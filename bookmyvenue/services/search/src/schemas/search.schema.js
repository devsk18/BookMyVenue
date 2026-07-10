export const searchVenueSchema = {
    tags: ["Search"],
    summary: "Search venues",
    description: "Search venues using text, geo location and various filters.",

    querystring: {
        type: "object",

        properties: {
            q: {
                type: "string",
                description: "Full-text search query"
            },

            city: {
                type: "string"
            },

            state: {
                type: "string"
            },

            country: {
                type: "string"
            },

            lat: {
                type: "number",
                minimum: -90,
                maximum: 90
            },

            lon: {
                type: "number",
                minimum: -180,
                maximum: 180
            },

            radius: {
                type: "string"
            },

            priceMin: {
                type: "integer",
                minimum: 0
            },

            priceMax: {
                type: "integer",
                minimum: 0
            },

            capacityMin: {
                type: "integer",
                minimum: 0
            },

            capacityMax: {
                type: "integer",
                minimum: 0
            },

            rating: {
                type: "number",
                minimum: 0,
                maximum: 5
            },

            amenities: {
                type: "array",
                items: {
                    type: "string"
                }
            },

            sort: {
                type: "string",
                enum: [
                    "relevance",
                    "rating",
                    "price_asc",
                    "price_desc",
                    "capacity",
                    "distance"
                ]
            },

            page: {
                type: "integer",
                minimum: 1,
                default: 1
            },

            limit: {
                type: "integer",
                minimum: 1,
                maximum: 100,
                default: 20
            }
        }
    },

    response: {
        200: {
            type: "object",
            properties: {
                count: {
                    type: "integer"
                },

                time: {
                    type: "string"
                },

                page: {
                    type: "integer",
                    minimum: 1
                },

                limit: {
                    type: "integer",
                    minimum: 1,
                    maximum: 100
                },

                totalPages: {
                    type: "integer",
                    minimum: 0
                },

                hasNextPage: {
                    type: "boolean"
                },

                hasPreviousPage: {
                    type: "boolean"
                },

                results: {
                    type: "array",

                    items: {
                        type: "object",

                        additionalProperties: false,

                        properties: {
                            score: { type: "number" },
                            id: { type: "string" },
                            name: { type: "string" },
                            description: { type: "string" },
                            city: { type: "string" },
                            state: { type: "string" },
                            country: { type: "string" },
                            capacity: { type: "integer" },
                            pricePerDay: { type: "integer" },
                            rating: { type: "number" },

                            amenities: {
                                type: "array",
                                items: {
                                    type: "string"
                                }
                            },

                            location: {
                                type: "object",

                                properties: {
                                    lat: { type: "number" },
                                    lon: { type: "number" }
                                },

                                required: ["lat", "lon"]
                            }
                        },

                        required: [
                            "score",
                            "id",
                            "name",
                            "city"
                        ]
                    }
                }
            },

            required: [
                "count",
                "time",
                "results",
                "page",
                "limit",
                "totalPages",
                "hasNextPage",
                "hasPreviousPage"
            ]
        }
    }
};