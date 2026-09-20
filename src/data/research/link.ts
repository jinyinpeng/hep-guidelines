/**
 * 生成 PubMed 检索链接。
 *
 * 数据文件里只记录研究名称/标题，链接交由这里统一生成：
 * 好处是任何条目都必然指向一个可用的检索入口，且不会出现臆造的 DOI。
 * 如果确知 DOI 或期刊页地址，直接在条目里写 `url` 覆盖即可。
 */
export function pm(term: string): string {
  return `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(term)}`
}
