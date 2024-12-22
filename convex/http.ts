import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
    path: "/clerk-webhook",
    method:"POST",
    handler: httpAction(async (ctx,request) => {
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
        if(!webhookSecret){
            throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
        }
        const svixId = request.headers.get("svix-id");
        const svixTimestamp = request.headers.get("svix-timestamp");
        const svixSignature = request.headers.get("svix-signature");
        if(!svixId || !svixTimestamp || !svixSignature){
            throw new Error("Missing svix headers");
        }
        
        const payload = await request.json();
        const body = JSON.stringify(payload);

        const wh = new Webhook(webhookSecret);
        let evt:WebhookEvent;

        try {
            evt = wh.verify(body,{
                "svix-id":svixId,
                "svix-timestamp":svixTimestamp,
                "svix-signature":svixSignature
            }) as WebhookEvent;
        } catch (error) {
            console.error("Error verifying webhook",error);
            return new Response("Error verifying webhook",{
                status:400
            })
        }

        const eventType = evt.type;
        if(eventType==="user.created"){
            const {id,email_addresses,first_name,last_name} = evt.data;
            const email = email_addresses[0].email_address;
            const name = `${first_name} ${last_name}`.trim();

            try {
                // save user to db
                await ctx.runMutation(api.users.syncUser,{
                    userId:id,
                    email,
                    name
                })
            } catch (error) {
                return new Response("Error creating user",{
                    status:500
                })
            }

        }

        return new Response("Webhook processed successfully",{
            status:200
        })

    })
});

export default http;