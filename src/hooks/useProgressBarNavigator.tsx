import { useRouter } from "next/navigation";
import NProgress from "nprogress";

export default function useProgressBarNavigation() {
  const router = useRouter();

  function push(href: string) {
    NProgress.start();
    router.push(href);
  }
  function replace(href: string) {
    NProgress.start();
    router.replace(href);
  }
  function back() {
    NProgress.start();
    router.back();
  }
  return { push, replace, back };
}
