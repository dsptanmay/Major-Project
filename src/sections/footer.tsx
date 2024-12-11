export default function Footer() {
  return (
    <footer className="m500:text-sm z-30 border-t-[3px] border-border bg-white px-5 py-5 text-center font-base dark:bg-secondaryBlack sm:flex-col sm:space-y-3">
      Made by Batch B7. The source code is available on{" "}
      <a
        target="_blank"
        href="https://gitlab.com/dsptanmay/major-project-v2"
        className="font-heading underline"
      >
        GitLab
      </a>
      .
    </footer>
  );
}