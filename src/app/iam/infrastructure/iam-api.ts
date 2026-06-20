import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApi } from '../../shared/infrastructure/base-api';
import { CreateSupervisorCommand } from '../domain/model/create-supervisor.command';
import { SignInCommand } from '../domain/model/sign-in.command';
import { SignUpCommand } from '../domain/model/sign-up.command';
import { Supervisor } from '../domain/model/supervisor.entity';
import { ChangePasswordApiEndpoint } from './change-password-api-endpoint';
import { ForgotPasswordApiEndpoint } from './forgot-password-api-endpoint';
import { SignInApiEndpoint } from './sign-in-api-endpoint';
import { SignInAssembler } from './sign-in-assembler';
import { SignInResource } from './sign-in-response';
import { SignUpApiEndpoint } from './sign-up-api-endpoint';
import { SignUpAssembler } from './sign-up-assembler';
import { SignUpResource } from './sign-up-response';
import { SupervisorsApiEndpoint } from './supervisors-api-endpoint';

/**
 * Application service facade for IAM domain API operations.
 *
 * @remarks
 * In Domain-Driven Design, this service acts as the application layer facade
 * coordinating access to IAM domain resources through HTTP endpoints.
 *
 * Each operation is delegated to specialized endpoint clients.
 */
@Injectable({ providedIn: 'root' })
export class IamApi extends BaseApi {
  /**
   * Endpoint client for sign-up operations.
   * @private
   */
  private readonly signUpEndpoint: SignUpApiEndpoint;
  private readonly signInEndpoint: SignInApiEndpoint;
  private readonly supervisorsEndpoint: SupervisorsApiEndpoint;
  private readonly changePasswordEndpoint: ChangePasswordApiEndpoint;
  private readonly forgotPasswordEndpoint: ForgotPasswordApiEndpoint;

  /**
   * Creates an instance of IamApi.
   *
   * @param http - Angular HttpClient for making HTTP requests
   */
  constructor(http: HttpClient) {
    super();
    this.signUpEndpoint = new SignUpApiEndpoint(http, new SignUpAssembler());
    this.signInEndpoint = new SignInApiEndpoint(http, new SignInAssembler());
    this.supervisorsEndpoint = new SupervisorsApiEndpoint(http);
    this.changePasswordEndpoint = new ChangePasswordApiEndpoint(http);
    this.forgotPasswordEndpoint = new ForgotPasswordApiEndpoint(http);
  }

  /**
   * Registers a new user account in the IAM system.
   */
  signUp(signUpCommand: SignUpCommand): Observable<SignUpResource> {
    return this.signUpEndpoint.signUp(signUpCommand);
  }

  /**
   * Authenticates a user with the IAM system.
   */
  signIn(signInCommand: SignInCommand): Observable<SignInResource> {
    return this.signInEndpoint.signIn(signInCommand);
  }

  /**
   * Retrieves the supervisor directory.
   */
  getSupervisors(): Observable<Supervisor[]> {
    return this.supervisorsEndpoint.getAll();
  }

  /**
   * Registers a new supervisor from a domain command.
   */
  createSupervisor(command: CreateSupervisorCommand): Observable<Supervisor> {
    return this.supervisorsEndpoint.createFromCommand(command);
  }

  /**
   * Persists changes to an existing supervisor (e.g., access status updates).
   */
  updateSupervisor(supervisor: Supervisor): Observable<Supervisor> {
    return this.supervisorsEndpoint.update(supervisor, supervisor.id);
  }

  /** Sends PUT /authentication/change-password with the new plain-text password. */
  changePassword(newPassword: string): Observable<void> {
    return this.changePasswordEndpoint.changePassword(newPassword);
  }

  /** Sends POST /authentication/forgot-password with the corporate email. */
  forgotPassword(email: string): Observable<void> {
    return this.forgotPasswordEndpoint.forgotPassword(email);
  }
}
