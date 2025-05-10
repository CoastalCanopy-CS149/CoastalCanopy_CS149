// Get user's first name initial
export const getUserInitial = (isUserLoggedIn=false, user) => {
    if (!isUserLoggedIn || !user) return "U";
    if (user?.user.firstName) return user?.user.firstName.charAt(0).toUpperCase();
    if (user?.user.username) return user?.user.username.charAt(0).toUpperCase();
    if (user?.user.email) return user?.user.email.charAt(0).toUpperCase();
    return "U";
  };

  // Get username for display
export  const getUsername = (isUserLoggedIn=false, user) => {
    console.log("user", user.user);
    if (!isUserLoggedIn || !user) return "User";
    if (user?.user.username) return user?.user.username;
    if (user?.user.firstName) return user?.user.firstName;
    if (user?.user.email) return user?.user.email.split("@")[0];
    return "User";
  };
