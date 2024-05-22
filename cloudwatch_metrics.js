import {
  CloudWatch_Metric,
  calculate_length,
  getFiveMinAgoObjects
} from "./helper-methods.js";
import { S3_BucketPrefix } from "./constant.js";
const cloudwatch_metric = async () => {
  const { length: inp1Length } = await calculate_length(
    S3_BucketPrefix.S3Metric1
  );
  const { length: inp2Length } = await calculate_length(
    S3_BucketPrefix.S3Metric2
  );
  const { objects: inp3Objects } = await calculate_length(
    S3_BucketPrefix.S3Metric3
  );
  const inp3ObjLen = getFiveMinAgoObjects(inp3Objects);

  //Creating CloudWatch Metrics
  const response1 = await CloudWatch_Metric({
    ...S3_BucketPrefix.S3Metric1,
    value: inp1Length,
    metricName: "s3Metric1"
  });
  const response2 = await CloudWatch_Metric({
    ...S3_BucketPrefix.S3Metric2,
    value: inp2Length,
    metricName: "s3Metric2"
  });
  const response3 = await CloudWatch_Metric({
    ...S3_BucketPrefix.S3Metric3,
    value: inp3ObjLen,
    metricName: "s3Metric3"
  });
  if (response1 && response2 && response3) {
    console.log("cloudwatch Metrics Created");
  }
};
cloudwatch_metric();
