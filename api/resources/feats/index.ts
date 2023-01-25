import { FeatController } from "./feat.controller";
import { FeatFactory } from "./feat.factory";
import { FeatService } from "./feat.service";
import { FeatSchema } from "./feat.schema";

export function bootstrapFeats({ prisma }) {
  const featSchema = new FeatSchema();
  const featService = new FeatService({ prisma });
  const featController = new FeatController({ service: featService });
  const featFactory = FeatFactory;
  return {
    schema: featSchema,
    service: featService,
    controller: featController,
    factory: featFactory,
  };
}
