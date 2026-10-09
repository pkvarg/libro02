import Header from '@/components/Header'

export interface LegalSection {
  id: string
  title: string
  // A string is a paragraph; an array of strings is a bullet list.
  body: (string | string[])[]
}

interface LegalTextProps {
  label: string
  effective: string
  intro?: string
  sections: LegalSection[]
}

const LegalText = ({ label, effective, intro, sections }: LegalTextProps) => (
  <>
    <Header showBackArrow label={label} />
    <article className="card flex flex-col gap-3 p-5 leading-relaxed text-ink-soft sm:p-8">
      <p className="text-sm text-ink-muted">{effective}</p>
      {intro && <p>{intro}</p>}
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-4 mt-2">
          <h2 className="mb-2 font-display text-xl font-semibold text-ink">{section.title}</h2>
          {section.body.map((block, i) =>
            Array.isArray(block) ? (
              <ul key={i} className="mb-2 ml-6 list-disc space-y-1 marker:text-ink-faint">
                {block.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ) : (
              <p key={i} className="mb-2">
                {block}
              </p>
            )
          )}
        </section>
      ))}
    </article>
  </>
)

export default LegalText
