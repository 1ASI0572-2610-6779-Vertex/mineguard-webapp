import { SignUpRequest } from './sign-up.request';
import { SignUpCommand } from '../domain/model/sign-up.command';
import { SignUpResource, SignUpResponse } from './sign-up-response';

/**
 * Assembler for converting between SignUpCommand domain commands and infrastructure payloads.
 */
export class SignUpAssembler {
  /**
   * Converts an API endpoint response into an application-level resource.
   *
   * @param response - Raw response object returned by the sign-up endpoint
   * @returns Mapped sign-up resource ready for application use
   */
  toResourceFromResponse(response: SignUpResponse): SignUpResource {
    return {
      id: response.id,
      username: response.username,
    } as SignUpResource;
  }

  /**
   * Converts a domain sign-up command into the request payload for the API.
   *
   * @param command - Domain command with registration credentials
   * @returns HTTP request payload in the format expected by the sign-up endpoint
   */
  toRequestFromCommand(command: SignUpCommand): SignUpRequest {
    return {
      username: command.username,
      password: command.password,
    } as SignUpRequest;
  }
}
