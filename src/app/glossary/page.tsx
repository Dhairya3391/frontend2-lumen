"use client"

import { useState } from "react"
import { medicalGlossary } from "@/lib/glossary"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Search, BookOpen } from "lucide-react"

export default function GlossaryPage() {
  const [search, setSearch] = useState("")

  const filteredTerms = medicalGlossary.filter((item) =>
    item.term.toLowerCase().includes(search.toLowerCase()) ||
    item.definition.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4 flex items-center justify-center gap-3">
            <BookOpen className="h-8 w-8 text-teal-600" />
            Medical Glossary
        </h1>
        <p className="text-slate-600">
          Understand the terminology used in your cardiovascular health assessment.
        </p>
      </div>

      <div className="max-w-md mx-auto mb-10 relative">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
        <Input
          placeholder="Search terms..."
          className="pl-10 h-12 text-base"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTerms.length > 0 ? (
          filteredTerms.map((item, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-teal-600 mb-1">
                    {item.category}
                </div>
                <CardTitle className="text-lg">{item.term}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.definition}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
            <div className="col-span-full text-center py-12 text-slate-500">
                No terms found matching "{search}"
            </div>
        )}
      </div>
    </div>
  )
}
