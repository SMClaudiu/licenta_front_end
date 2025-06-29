import api from './apiClient';
import { ClientDTO } from '../types/api';

export async function updateClientField(clientId: number, field: 'name' | 'email' | 'phoneNumber', value: string): Promise<ClientDTO> {
    let endpoint = '';
    let paramName = '';

    switch (field) {
        case 'name':
            endpoint = `/client/updateClientName/${clientId}`;
            paramName = 'new_name';
            break;
        case 'email':
            endpoint = `/client/updateClientEmail/${clientId}`;
            paramName = 'new_email';
            break;
        case 'phoneNumber':
            endpoint = `/client/updateClientPhoneNumber/${clientId}`;
            paramName = 'new_phone_number';
            break;
        default:
            throw new Error('Invalid field for update');
    }

    const response = await api.patch(endpoint, null, {
        params: { [paramName]: value },
    });

    return response.data;
}

export async function changeClientPassword(clientId: number, oldPassword: string, newPassword: string): Promise<any> {
    const endpoint = `/client/updateClientPassword/${clientId}`;
    const response = await api.patch(endpoint, null, {
        params: {
            old_password: oldPassword,
            new_password: newPassword },
    });

    return response.data;
}

export async function deleteClientAccount(id: number): Promise<void> {
    const endpoint = `/client/removeById/${id}`;
    await api.delete(endpoint);
}
