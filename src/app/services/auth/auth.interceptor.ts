import { HttpInterceptorFn } from '@angular/common/http';

function getCookie(name: string): string | null {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = getCookie('auth_token');

    if (token) {
        const clonedRequest = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
        return next(clonedRequest);
    }

    return next(req);
};