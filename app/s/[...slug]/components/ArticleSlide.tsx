import { ChapterList, ElogCacheData } from "@/lib/elog";
import { mylog } from "@/lib/utils";
import { ElogChapter } from "@/types/elog";

// 假定 chapters 是整个章节树的根节点数组
function findChapters(
  chapters: ElogChapter[],
  currentUuid: string,
  prevChapter: ElogChapter | null = null
): { prev: ElogChapter | null; next: ElogChapter | null } {
  let prev: ElogChapter | null = prevChapter;
  let next: ElogChapter | null = null;
  let currentFound = false;

  for (let i = 0; i < chapters.length && next === null; i++) {
    const chapter = chapters[i];

    // 当前章节已找到，下一个章节是本章节的第一个子章节或下一个同级章节
    if (currentFound) {
      next = chapter;
      break;
    }

    // 找到当前章节
    if (chapter.url === currentUuid) {
      currentFound = true;
      // 尝试找到当前章节的下一个兄弟节点或子节点
      if (i + 1 < chapters.length) {
        next = chapters[i + 1];
      } else if (chapter.children && chapter.children.length > 0) {
        next = chapter.children[0];
      }
      continue;
    }

    // 如果当前章节有子章节，递归查找子章节
    if (chapter.children.length > 0) {
      const result = findChapters(chapter.children, currentUuid, chapter);
      if (result.next) {
        return result; // 如果在子章节中找到下一章，直接返回结果
      }
    }

    // 如果当前章节还没找到，那它可能是上一章节
    if (!currentFound) {
      prev = chapter;
    }
  }

  // 只有在未找到下一章节时，才返回上一章节，避免递归中的重复返回
  return { prev: currentFound ? prev : null, next };
}

// 假定您的UI组件
export function ArticleSlideLinks({ path }: { path: string }) {
  const { prev, next } = findChapters(ChapterList, path);
  mylog(process.env.NODE_ENV);
  return (
    <div
      className="flex flex-row justify-between
      px-auto
     rounded-sm
    bg-slate-50 p-8 dark:bg-slate-800
    text-center
    lg:text-xl"
    >
      {prev ? (
        <div
          className=" self-start  min-w-8 py-6 px-2 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200
        hover:dark:bg-gray-400"
        >
          <span>{"< "}</span>
          <a href={prev.url}>{prev.title}</a>
        </div>
      ) : (
        <span />
      )}

      {next ? (
        <div
          className=" self-end min-w-8 py-6 px-2 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200
        
        hover:dark:bg-gray-400"
        >
          <a href={next.url} className="">
            {next.title}
          </a>{" "}
          <span>{">"}</span>{" "}
        </div>
      ) : (
        <span />
      )}
    </div>
  );
}
