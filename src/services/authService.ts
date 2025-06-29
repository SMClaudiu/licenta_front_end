import api from './apiClient';
import {ClientDTO, SigninRequest, LoginResponse} from "../types/api";
import {storage} from "../utils/storage";

export class AuthService {
    static async login(email: string, password: string): Promise<{ token: string; client: ClientDTO }> {
        try {
            const response = await api.post('/client/login', { email, password });
            const {token, client} = response.data;

            storage.set('userToken', token);
            storage.set('userClient', client);

            return response.data; // response.data contains { token, client }
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data || 'Login failed');
            }
            throw new Error('Network error during login');
        }
    }

    static async logout(): Promise<void> {
        try {
            await api.post('/client/logout');
            storage.remove('userToken')
            storage.remove('userClient')
        } catch (error: any) {
            console.error('Logout failed', error);
            throw new Error('Logout failed');
        }
    }

    static async signin(signInData: SigninRequest): Promise<LoginResponse>{
        try{
            const response = await api.patch('/client/signin', signInData);

            const { token, client } = response.data

            storage.set('userToken', token);
            storage.set('userClient', client)

            return response.data; //token + client

        }
        catch (error:any){
            if(error.response){
                throw new Error(error.response.data || 'Sign in failed')
            }
            throw new Error('Error during sign in process')
        }
    }
}
