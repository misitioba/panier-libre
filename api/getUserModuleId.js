module.exports = app => {
    return async function getUserModuleId(id) {
        // Return the id of the user module (basket_hot) tied to the current user
        if(!this.user){
            return 0
        }
        let match = this.user.modules.find(um => um.module_id == this.moduleId)
        return match && match.id || 0
    }
}