import { api, ENDPOINT } from '../../../App/api';
import type { HeatmapResponse, TimelineResponse, SummaryResponse } from '../types/contribution.types';

class ContributionService {
    async getHeatmap(userId: string, year?: number): Promise<HeatmapResponse> {
        const query = year ? `?year=${year}` : '';
        const response = await api.get(`${ENDPOINT}/api/v1/contributions/heatmap/${userId}${query}`);
        return response.data;
    }

    async getTimeline(userId: string, date?: string): Promise<TimelineResponse> {
        const query = date ? `?date=${date}` : '';
        const response = await api.get(`${ENDPOINT}/api/v1/contributions/timeline/${userId}${query}`);
        return response.data;
    }

    async getSummary(userId: string): Promise<SummaryResponse> {
        const response = await api.get(`${ENDPOINT}/api/v1/contributions/summary/${userId}`);
        return response.data;
    }
}

export default new ContributionService();
