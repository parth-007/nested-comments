import dotenv from "dotenv";
dotenv.config();
import fastify from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import sensible from "@fastify/sensible";
import { PrismaClient } from "@prisma/client";


const app = fastify();
app.register(sensible);
app.register(cookie, {
  secret: process.env.COOKIE_SECRET
});
app.register(cors, {
  origin: process.env.CLIENT_URL,
  credentials: true
})

// Middleware
// done is same as next
app.addHook("onRequest", (req, res, done) => {
  if (req.cookies.userId !== CURRENT_USER_ID) {
    req.cookies.userId = CURRENT_USER_ID;
    res.clearCookie("userId");
    res.setCookie("userId", CURRENT_USER_ID);
  }
  done();
});
const prisma = new PrismaClient();


// Fake Login [Says current user is Kyle]
// const CURRENT_USER_ID = await prisma.user.findUnique({where: {name: "Kyle"}}).id;

const CURRENT_USER_ID = (
  await prisma.user.findFirst({ where: { name: "Kyle" } })
).id

const COMMENT_SELECT_FIELDS = {
  id: true,
  message: true,
  parentId: true,
  createdAt: true,
  user: {
    select: {
      name: true,
      id: true
    }
  }
}

app.get("/posts", async (req, res) => {
  return await commitToDb(prisma.post.findMany({
    select: {
      id: true,
      title: true,
    },
  }));
});

app.get("/posts/:id", async (req, res) => {
  return await commitToDb(
    prisma.post.findUnique({
      where: {
        id: req.params.id
      },
      select: {
        body: true,
        title: true,
        comments: {
          orderBy: {
            createdAt: "desc"
          },
          select: {
            ...COMMENT_SELECT_FIELDS,
            _count: { select: { likes: true } }
          }
        }
      }
    }).then(async post => {
      const likes = await prisma.like.findMany({
        where: {
          userId: req.cookies.userId,
          commentId: {
            in: post.comments.map(comment => comment.id)
          }
        }
      });

      return {
        ...post,
        comments: post.comments.map(comment => {
          const {_count, ...commentFields} = comment;
          return {
            ...commentFields,
            likedByMe: likes.find(like => like.commentId === comment.id),
            likeCount: _count.likes
          }
        })
      }
    })
    );
});

app.post("/posts/:id/comments", async (req, res) => {
  if (req.body.message === "" || req.body.message == null) {
    return res.send(app.httpErrors.badRequest("Message is Required"));
  }
  console.log(80, req.cookies);
  return await commitToDb(
    prisma.comment.create({
      data: {
        message: req.body.message,
        userId: req.cookies.userId, // Fake Cookie
        parentId: req.body.parentId,
        postId: req.params.id
      },
      select: COMMENT_SELECT_FIELDS
    })
  )
});

app.put("/posts/:postId/comments/:commentId", async (req, res) => {
  if (req.body.message === "" || req.body.message == null) {
    return res.send(app.httpErrors.badRequest("Message is Required"));
  }

  // Only Edit the comments that you have made
  const { userId } = await prisma.comment.findUnique(
    {
      where: { id: req.params.commentId },
      select: { userId: true }
    }
  );

  if (userId !== req.cookies.userId) {
    res.send(app.httpErrors.badRequest("You do not have permissions to edit this message"));
  }

  return await commitToDb(prisma.comment.update({
    where: {
      id: req.params.commentId
    },
    data: {
      message: req.body.message
    },
    select: { message: true }
  }))
});

app.delete("/posts/:postId/comments/:commentId", async (req, res) => {
  // Only Delete the comments that you have made
  const { userId } = await prisma.comment.findUnique(
    {
      where: { id: req.params.commentId },
      select: { userId: true }
    }
  );

  if (userId !== req.cookies.userId) {
    res.send(app.httpErrors.badRequest("You do not have permissions to delete this message"));
  }

  return await commitToDb(prisma.comment.delete({
    where: {
      id: req.params.commentId
    },
    select: { id: true }
  }))
});

async function commitToDb(promise) {
  const [error, data] = await app.to(promise);
  if (error) return app.httpErrors.internalServerError(error.message);
  return data;
}

app.listen({ port: process.env.PORT }, () => {
  console.log("Listening");
});
