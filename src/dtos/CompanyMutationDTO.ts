import { v4 as uuidv4 } from 'uuid';
import { CreateMediaDTO, UpdateMediaDTO } from './MediaMutationDTO';

export class CreateCompanyDTO {
  [key: string]: any;
    constructor(input: any = {}) {
        this.created_at = new Date();
        this.updated_at = new Date();
        this.uuid = uuidv4();
        
        // Mobile / Phone
        const rawPhone = input.mobilePhone || input.mobile_phone || input.phone || '11999999999';
        this.mobile_phone = String(rawPhone).replace(/\D/g, '') || 11999999999;
        
        // Location / Address
        let city = input.city;
        let state = input.state;
        if ((!city || !state) && input.location) {
            const parts = input.location.split(',').map((s: string) => s.trim());
            city = city || parts[0] || 'São Paulo';
            state = state || parts[1] || 'SP';
        }
        this.city = city || 'São Paulo';
        this.state = state || 'SP';
        this.neighborhood = input.neighborhood || 'Centro';
        this.number = input.number || 'S/N';
        this.street = input.street || 'Principal';
        
        const rawZip = input.zipCode || input.zip_code || '01001000';
        this.zip_code = String(rawZip).replace(/\D/g, '') || 1001000;
        
        this.name = input.name || '';
        const rawCnpj = input.cnpj || '00000000000100';
        this.cnpj = String(rawCnpj).replace(/\D/g, '') || 100;
        
        this.description = input.description || '';
        this.logo = input.logo || input.logoUrl || 'default_logo.png';
        this.segment = input.segment || input.industry || 'Geral';
        this.user_id = input.userId || input.user_id || input.userId;
        this.medias = input.medias ? input.medias.map((m: any) => new CreateMediaDTO(m)) : null;
    }
}

export class UpdateCompanyDTO {
  [key: string]: any;
    constructor(input: any = {}) {
        if (input.mobilePhone || input.mobile_phone || input.phone) {
            const rawPhone = input.mobilePhone || input.mobile_phone || input.phone;
            this.mobile_phone = String(rawPhone).replace(/\D/g, '');
        }
        if (input.city) this.city = input.city;
        if (input.state) this.state = input.state;
        if (input.neighborhood) this.neighborhood = input.neighborhood;
        if (input.number) this.number = input.number;
        if (input.street) this.street = input.street;
        if (input.zipCode || input.zip_code) {
            const rawZip = input.zipCode || input.zip_code;
            this.zip_code = String(rawZip).replace(/\D/g, '');
        }
        if (input.name) this.name = input.name;
        if (input.cnpj) {
            this.cnpj = String(input.cnpj).replace(/\D/g, '');
        }
        if (input.description !== undefined) this.description = input.description;
        if (input.logo || input.logoUrl) this.logo = input.logo || input.logoUrl;
        if (input.segment || input.industry) this.segment = input.segment || input.industry;
        if (input.userId || input.user_id) this.user_id = input.userId || input.user_id;
        if (input.medias) this.medias = input.medias.map((m: any) => new UpdateMediaDTO(m));
    }
}
