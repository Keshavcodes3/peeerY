import { api, ENDPOINT } from "../../../App/api";
import type { AuthResponseDto, UserDto } from "../DTO/auth.dto";

// Instead of register and login, we just have a syncAccount that pushes Clerk user details to our backend
const syncAccount = async (userData: { email: string, username: string, avatar: string, provider: 'local' | 'github' | 'google' }): Promise<AuthResponseDto> => {
    const response = await api.post(ENDPOINT.auth.sync, userData);
    return response.data;
};

const getMe = async (): Promise<{ success: boolean; user: UserDto }> => {
    const response = await api.get(ENDPOINT.auth.me);
    return response.data;
};

const disableAccount = async (): Promise<{ success: boolean; message: string; user: UserDto }> => {
    const response = await api.put(ENDPOINT.auth.disable);
    return response.data;
};

const deleteAccount = async (): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(ENDPOINT.auth.delete);
    return response.data;
};

const authService = {
    syncAccount,
    getMe,
    disableAccount,
    deleteAccount
};

export default authService;