import { S3Client, ListObjectsCommand } from "@aws-sdk/client-s3"; // ES Modules import
import {
    CloudWatchClient,
    PutMetricDataCommand
  } from "@aws-sdk/client-cloudwatch";
const s3Client = new S3Client({ region: "eu-west-2" });
const client = new CloudWatchClient({ region: "eu-west-2" });
export const calculate_length = async ({ bucket, prefix }) => {
  const input = {
    // ListObjectsRequest
    Bucket: bucket, // required
    Prefix: prefix
  };
  const command = new ListObjectsCommand(input);
  const response = await s3Client.send(command);
  return {
    length: response.Contents?.length,
    objects: response.Contents
  };
};
export const getFiveMinAgoObjects = (objects) => {
  const now = new Date();

  // Subtract 5 minutes from the current time
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
  // Filter objects based on the LastModified field
  const recentUploads = objects.filter(
    (obj) => new Date(obj.LastModified) <= fiveMinutesAgo
  );

  return recentUploads?.length;
};
export const CloudWatch_Metric = async ({
  value,
  metricName,
  bucket,
  prefix
}) => {
  const input = {
    // PutMetricDataInput
    Namespace: "S3Metrics", // required
    MetricData: [
      // MetricData // required
      {
        // MetricDatum
        MetricName: metricName, // required
        Dimensions: [
          // Dimensions
          {
            // Dimension
            Name: "S3", // required
            Value: bucket // required
          },
          {
            Name: "Prefix",
            Value: prefix
          }
        ],
        Timestamp: new Date(),
        Value: Number(value),
        Unit: "Count"
      }
    ]
  };
  const command = new PutMetricDataCommand(input);
  const response = await client.send(command);
  return response;
};
