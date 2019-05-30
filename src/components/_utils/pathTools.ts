// /userinfo/2144/id => ['/userinfo','/useinfo/2144,'/userindo/2144/id']
export function urlToList(url: string) {
  const urllist = url.split('/').filter(i => i);
  return urllist.map((_, index) => {
    return `/${urllist.slice(0, index + 1).join('/')}`;
  });
}
