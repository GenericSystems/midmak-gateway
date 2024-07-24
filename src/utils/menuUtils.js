// utils/menuUtils.js


export function checkIsAddForPage(menu = [], pathname) {
  if (!Array.isArray(menu)) {
    console.error("Expected menu to be an array, but received:", menu);
    return false;
  }

  function recursiveCheck(menuItems, path) {
    for (const item of menuItems) {
      if (item.to === path) {
        return item.isAdd === 1;
      }
      if (item.children && item.children.length > 0) {
        const result = recursiveCheck(item.children, path);
        if (result) {
          return true;
        }
      }
    }
    return false;
  }

  return recursiveCheck(menu, pathname);
}

export function checkIsDeleteForPage(menu = [], pathname) {
  if (!Array.isArray(menu)) {
    console.error("Expected menu to be an array, but received:", menu);
    return false;
  }

  function recursiveCheck(menuItems, path) {
    for (const item of menuItems) {
      if (item.to === path) {
        return item.isDelete === 1;
      }
      if (item.children && item.children.length > 0) {
        const result = recursiveCheck(item.children, path);
        if (result) {
          return true;
        }
      }
    }
    return false;
  }

  return recursiveCheck(menu, pathname);
}

export function checkIsEditForPage(menu = [], pathname) {
  if (!Array.isArray(menu)) {
    console.error("Expected menu to be an array, but received:", menu);
    return false;
  }

  function recursiveCheck(menuItems, path) {
    for (const item of menuItems) {
      if (item.to === path) {
        return item.isEdit === 1;
      }
      if (item.children && item.children.length > 0) {
        const result = recursiveCheck(item.children, path);
        if (result) {
          return true;
        }
      }
    }
    return false;
  }

  return recursiveCheck(menu, pathname);
}

export function checkIsSearchForPage(menu = [], pathname) {
  if (!Array.isArray(menu)) {
    console.error("Expected menu to be an array, but received:", menu);
    return false;
  }

  function recursiveCheck(menuItems, path) {
    for (const item of menuItems) {
      if (item.to === path) {
        return item.isSearch === 1;
      }
      if (item.children && item.children.length > 0) {
        const result = recursiveCheck(item.children, path);
        if (result) {
          return true;
        }
      }
    }
    return false;
  }

  return recursiveCheck(menu, pathname);
}

export function getPageFromMenu(menu = [], pathname) {
  if (!Array.isArray(menu)) {
    console.error("Expected menu to be an array, but received:", menu);
    return null;
  }

  function recursiveSearch(menuItems, path) {
    for (const item of menuItems) {
      if (item.to === path) {
        return item; // Return the whole object if path matches
      }
      if (item.children && item.children.length > 0) {
        const result = recursiveSearch(item.children, path);
        if (result) {
          return result; // Return the found object
        }
      }
    }
    return null; // Return null if not found
  }

  return recursiveSearch(menu, pathname);
}
