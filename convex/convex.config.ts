import wearables from "@clipin/convex-wearables/convex.config";
import { defineApp } from "convex/server";

const app = defineApp();
app.use(wearables);

export default app;
