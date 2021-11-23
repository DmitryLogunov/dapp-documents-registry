export const SWAGGER_METADATA_KEYS = {
  apiTags: "swagger/apiUseTags",
  apiResponse: "swagger/apiResponse",
  apiOperation: "swagger/apiOperation"
};

export const DEFAULT_SWAGGER_TAGS = ["JSON API"];

export const DEFAULT_SWAGGER_HTTP_ERRORS_CODES = {
  "400": {
    "description": "Ошибка обработки запроса"
  },
  "401": {
    "description": "Ошибка аутентификации"
  },
  "403": {
    "description": "Ошибка авторизации"
  },
  "500": {
    "description": "Ошибка сервера"
  }
};

export const SWAGGER_HTTP_SUCCESS_CODES = {
  getCollection: {
    code: 200,
    description: "Успешное получение коллекции"
  },
  getOne: {
    code: 200,
    description: "Успешное получение одной записи"
  },
  create: {
    code: 201,
    description: "Успешное создание одной записи"
  },
  update: {
    code: 204,
    description: "Успешное обновление одной записи"
  },
  delete: {
    code: 204,
    description: "Успешное удаление одной записи"
  }
};