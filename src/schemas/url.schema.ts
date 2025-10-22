import * as yup from "yup";

const createSchema = yup.object({
  originalUrl: yup.string().url("Invalid URL").required("URL is required"),
});

const getUrlSchema = yup.object({
  shortCode: yup.string().required("shortCode is required").max(10),
});

export { createSchema, getUrlSchema };
