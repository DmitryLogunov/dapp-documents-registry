export const NEST_ROUTE_ARGS_METADATA_KEY = "__routeArguments__";

const QUERY_PARSER_NEST_METADATA = (argIndex: number) => ({
  [`4:${argIndex}`]: {
    "index": argIndex,
    "data": undefined,
    "pipes": []
  }
});

const BODY_PARSER_NEST_METADATA = (argIndex: number) => ({
  [`3:${argIndex}`]: {
    "index": argIndex,
    "data": undefined,
    "pipes": []
  }
})

const PARAM_PARSER_NEST_METADATA = (
  argIndex: number,
  paramName: string
) => ({
  [`5:${argIndex}`]: {
    "index": argIndex,
    "data": paramName,
    "pipes": []
  }
});

export const NEST_PARSER_METADATA = {
  QUERY: QUERY_PARSER_NEST_METADATA,
  BODY: BODY_PARSER_NEST_METADATA,
  PARAM: PARAM_PARSER_NEST_METADATA
};