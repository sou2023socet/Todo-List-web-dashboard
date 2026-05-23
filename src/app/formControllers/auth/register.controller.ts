import { AuthRequest } from '../../models/auth-request.interface';

export class RegisterController {
  form: AuthRequest;

  constructor() {
    this.form = { username: '', password: '', tenantId: '', emailAddress: '' };
  }

  validate() {
    return !!this.form.username && !!this.form.password && !!this.form.tenantId && !!this.form.emailAddress;
  }

  getPayload(): AuthRequest {
    return this.form;
  }
}
