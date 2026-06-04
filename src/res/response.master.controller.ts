/**
 * @module ResponseStrategies
 *
 * This module defines various response strategies used in handling HTTP responses for different operations.
 * These strategies are designed to standardize the responses for CRUD operations and ensure consistency across the application.
 *
 * ### Design Patterns Used:
 *
 * 1. **Strategy Pattern**:
 *    - The response strategy classes follow the Strategy design pattern. Each class encapsulates the specific logic for handling a successful response for different types of operations, such as creation, updating, or deletion of resources.
 *
 * 2. **Builder Pattern**:
 *    - The `BaseResponseClass` uses the Builder pattern to construct API responses. The builder is used to set various parts of the response (status, message, data) before finalizing it with the `build` method.
 *
 * 3. **Error Handling Pattern**:
 *    - The `ApiError` class is used to handle errors consistently across all response types. Each strategy checks if the response is valid and returns an error when needed.
 *
 * ### Implementation Details:
 *
 * - **`OkResponseStrategy`**:
 *    Handles the creation of a generic "OK" response. This is used for successful requests that return data. It sets the response status to 200 and includes the provided data in the response body.
 *
 * - **`UpdateResponseStrategy`**:
 *    Similar to the `OkResponseStrategy`, but specifically used for successful update requests. It sets the status to 200 and returns the updated data.
 *
 * - **`CreateResponseStrategy`**:
 *    Used when a new resource has been created successfully. It responds with a 200 status code and the created data. The message is customized to indicate a successful creation.
 *
 * - **`DeleteResponseStrategy`**:
 *    Used when a resource is successfully deleted. It sends a response with a 204 (No Content) status, indicating that the resource has been deleted without returning any data.
 *
 * ### Key Points:
 *
 * - **Consistency in Responses**:
 *   Each response strategy ensures that the API responses follow a consistent structure, with clear status codes, messages, and data when appropriate.
 *
 * - **Use of BaseResponseClass**:
 *   All strategies inherit from the `BaseResponseClass`, which ensures that the same response building logic is reused across different types of responses.
 *
 * - **Support for Multiple Operations**:
 *   This module covers a wide range of HTTP methods, including creation (`POST`), update (`PUT`), deletion (`DELETE`), and retrieval (`GET`).
 *
 * ### Example Usage:
 *
 * - **OK Response**:
 *   To return a successful response with data, use `OkResponseStrategy.handleResponse(res, data)`.
 *
 * - **Update Response**:
 *   To return a successful response after updating a resource, use `UpdateResponseStrategy.handleResponse(res, updatedData)`.
 *
 * - **Create Response**:
 *   For a successful resource creation, use `CreateResponseStrategy.handleResponse(res, createdData)`.
 *
 * - **Delete Response**:
 *   To return a successful response after deletion, use `DeleteResponseStrategy.handleResponse(res)`.
 */

// Re-export all response strategies
export * from './response.ok.controller.js';
export * from './response.update.controller.js';
export * from './response.create.controller.js';
export * from './response.delete.controller.js';
