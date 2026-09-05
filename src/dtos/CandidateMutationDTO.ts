import { v4 as uuidv4 } from 'uuid';

export class CreateCandidateDTO {
  [key: string]: any;
    constructor(input) {
        this.created_at = new Date()
        this.updated_at = new Date()
        this.uuid = uuidv4()
        this.mobile_phone = input.mobilePhone
        this.city = input.city
        this.state = input.state
        this.neighborhood = input.neighborhood
        this.number = input.number
        this.street = input.street
        this.zip_code = input.zipCode
        this.name = input.name
        this.birth_date = input.birthDate
        this.cpf = input.cpf
        this.user_id = input.userId
        if (input.lookingForJob !== undefined) this.looking_for_job = Boolean(input.lookingForJob)
        if (input.inCareerTransition !== undefined) this.in_career_transition = Boolean(input.inCareerTransition)
        if (input.careerTransitionTarget !== undefined) this.career_transition_target = input.careerTransitionTarget
        if (input.acceptsEntryLevel !== undefined) this.accepts_entry_level = Boolean(input.acceptsEntryLevel)
    }
}

export class UpdateCandidateDTO {
  [key: string]: any;
    constructor(input) {
        if (input.mobilePhone !== undefined) this.mobile_phone = input.mobilePhone
        if (input.city !== undefined) this.city = input.city
        if (input.state !== undefined) this.state = input.state
        if (input.neighborhood !== undefined) this.neighborhood = input.neighborhood
        if (input.number !== undefined) this.number = input.number
        if (input.street !== undefined) this.street = input.street
        if (input.zipCode !== undefined) this.zip_code = input.zipCode
        if (input.name !== undefined) this.name = input.name
        if (input.birthDate !== undefined) this.birth_date = input.birthDate
        if (input.cpf !== undefined) this.cpf = input.cpf
        if (input.userId !== undefined) this.user_id = input.userId
        if (input.lookingForJob !== undefined) this.looking_for_job = Boolean(input.lookingForJob)
        if (input.inCareerTransition !== undefined) this.in_career_transition = Boolean(input.inCareerTransition)
        if (input.careerTransitionTarget !== undefined) this.career_transition_target = input.careerTransitionTarget
        if (input.acceptsEntryLevel !== undefined) this.accepts_entry_level = Boolean(input.acceptsEntryLevel)
    }
}
