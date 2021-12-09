const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function() {
ac.grant("basic")
 .readOwn("profile")
 .updateOwn("profile")

ac.grant("supervisor")
.readOwn("profile")
.updateOwn("profile")
 
 //.readAny("profile")
ac.grant("admin")
.readOwn("profile")
.updateOwn("profile")
.updateAny("profile")
.deleteAny("profile")
.readAny("profile")

return ac;
})();