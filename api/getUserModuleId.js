module.exports = app => {
    return async function getUserModuleId(id) {
        // Return the id of the user module (basket_hot) tied to the current user
        return this.user.modules.find(um => um.module_id == this.moduleId).id
    }
}