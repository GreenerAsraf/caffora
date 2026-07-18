"use client"

export function NewsletterForm() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
    >
      <input
        type="email"
        placeholder="your@email.com"
        className="flex-1 rounded-full border-0 bg-white/20 px-5 py-3 text-sm text-primary-foreground placeholder:text-primary-foreground/60 outline-none focus:bg-white/30"
      />
      <button
        type="submit"
        className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow transition-opacity hover:opacity-90"
      >
        Subscribe
      </button>
    </form>
  )
}
