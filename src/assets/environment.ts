export const environment = {
    urlTodo: "http://localhost:3001/664/todo",
    urlUserLogin: "http://localhost:3001/login",
    urlUserRegister: "http://localhost:3001/register"    
};

// json-server-auth
// Route	Resource permissions
// /664/*	User must be logged to write the resource.
//          Everyone can read the resource.
// /660/*	User must be logged to write or read the resource.
// /644/*	User must own the resource to write the resource.
//          Everyone can read the resource.
// /640/*	User must own the resource to write the resource.
//          User must be logged to read the resource.
// /600/*	User must own the resource to write or read the resource.
// /444/*	No one can write the resource.
//          Everyone can read the resource.
// /440/*	No one can write the resource.
//          User must be logged to read the resource.
// /400/*	No one can write the resource.
//          User must own the resource to read the resource.