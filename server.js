import dotenv from "dotenv";
dotenv.config();
import fastify from "fastify";
import cors from "@fastify/cors";
import sensible from "@fastify/sensible";
import { PrismaClient } from "@prisma/client";

const app = fastify();
app.register(sensible);
app.register(cors, {
    origin: process.env.CLIENT_URL,
    credentials: true
})
const prisma = new PrismaClient();

app.get("/posts", async (req, res) => {
  return await commitToDb(prisma.post.findMany({
    select: {
      id: true,
      title: true,
    },
  }));
});

app.get("/posts/:id", async (req, res) => {
    return await commitToDb(prisma.post.findUnique({
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
        }
      }
    }));
});

app.post("/posts/:id/comments", async (req, res) => {
  if (req.body.message === "" || req.body.message == null) {
    return res.send(app.httpErrors.badRequest("Message is Required"));
  }  
  return await commitToDb(
    prisma.comment.create({
      data: {
        message: req.body.message,
        userId: req.cookies.userId, // Fake Cookie
        parentId: req.body.parentId,
        postId: req.params.postId
      }
    })
  )
});

async function commitToDb(promise) {
    const [error, data] = await app.to(promise);
    if (error) return app.httpErrors.internalServerError(error.message);
    return data;
}

app.listen({ port: process.env.PORT }, () => {
  console.log("Listening");
});
