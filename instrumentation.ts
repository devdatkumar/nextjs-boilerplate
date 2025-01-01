// this is an optional file vercel OpenTelemetry - delete it in future.
import { registerOTel } from "@vercel/otel";

export function register() {
  registerOTel({ serviceName: "nextjs-boilerplate" });
}
