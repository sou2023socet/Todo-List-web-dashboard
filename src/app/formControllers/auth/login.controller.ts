import { AuthRequest } from '../../models/auth-request.interface';

export class LoginController {
  form: AuthRequest;

  constructor() {
    this.form = { username: '', password: '', tenantId: '' };
  }

  validate() {
    return !!this.form.username && !!this.form.password && !!this.form.tenantId;
  }

  getPayload(): AuthRequest {
    return this.form;
  }
}
