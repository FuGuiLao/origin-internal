export function Logo(props) {
   return (
    <div className="flex flex-col items-center justify-between gap-5 border-t border-zinc-900/5 pt-8 dark:border-white/5 sm:flex-row">
      <p className="text-xs text-zinc-600 dark:text-zinc-400">
        &copy; Copyright {new Date().getFullYear()} Origin Investigations Inc. All Rights Reserved.
      </p>
    </div>

    
  )
}
