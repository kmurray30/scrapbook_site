export function getDateGroup(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  
  // Reset time to compare only dates
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const postDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  const diffTime = today - postDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays >= 2 && diffDays <= 7) return 'This Week';
  if (diffDays >= 8 && diffDays <= 14) return 'Last Week';
  if (diffDays >= 15 && diffDays <= 30) return 'Earlier This Month';
  return 'Older';
}

export function groupPostsByDate(posts) {
  const groups = {};
  
  posts.forEach(post => {
    const group = getDateGroup(post.createdAt);
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(post);
  });
  
  // Return groups in order
  const order = ['Today', 'Yesterday', 'This Week', 'Last Week', 'Earlier This Month', 'Older'];
  const orderedGroups = {};
  
  order.forEach(groupName => {
    if (groups[groupName]) {
      orderedGroups[groupName] = groups[groupName];
    }
  });
  
  return orderedGroups;
}

export function getLimitedGroupedPosts(posts, maxGroups = 3, maxTotal = 4) {
  const grouped = groupPostsByDate(posts);
  const result = {};
  let totalCount = 0;
  let groupCount = 0;
  
  for (const [groupName, groupPosts] of Object.entries(grouped)) {
    if (groupCount >= maxGroups) break;
    
    const remaining = maxTotal - totalCount;
    if (remaining <= 0) break;
    
    result[groupName] = groupPosts.slice(0, remaining);
    totalCount += result[groupName].length;
    groupCount++;
    
    if (totalCount >= maxTotal) break;
  }
  
  return result;
}

