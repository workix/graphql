export default class MemberDTO {
    constructor(member){
        this.id = member.id
        this.createdAt = member.created_at
        this.updatedAt = member.updated_at
        this.uuid = member.uuid        
        this.name = member.name
        this.occupation = member.occupation
        this.picture = member.picture
        this.shortText = member.short_text        
    }
}