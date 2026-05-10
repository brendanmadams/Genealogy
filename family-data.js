window.FAMILY_DATA = {
  "version": "22.0",
  "meta": {
    "primary_subject": "brendan_mckeldin_adams",
    "total_nodes": 76,
    "last_updated": "2026-04-20",
    "schema_type": "pro_genealogical_engine",
    "status": "Repaired Master",
    "note": "Built from sources with strict temporal validation; canonical place_history used (no duplicated location fields). v22 adds Chuck McKeldin's separate spouse Michelle and children Jennifer and Charlie.",
    "invariant_enforced": "Residence != Death",
    "open_research": [
      "Michael Remy vitals/birthplace",
      "Trudy + Mike Remy wedding date",
      "Genevieve Mildred Smith DOD",
      "Emily Schriefer McKeldin DOB",
      "Emma Bell McKeldin maiden name",
      "Uncle Mike McKeldin DOB",
      "Connection from Peter Kolb (d.1748) to John Kulp (b.~1860) — undocumented",
      "George Francis Adams Jr. DOB",
      "Cynthia Gail Smith Adams DOB",
      "Children of George Francis Adams IV (George, Ted, Roy, Sam, Mary) DOBs",
      "Ray Zelmon Simons conflicting birth/death dates on Ancestry.com"
    ],
    "version_note_previous": "21.0"
  },
  "people": [
    {
      "id": "john_hamilton_of_kype",
      "name": {
        "full": "John Hamilton of Kype"
      },
      "lifespan": {
        "died": {
          "date": "before 1800",
          "place": "Scotland"
        }
      },
      "relationships": {
        "spouses": [
          "jacobina_young_hamilton"
        ],
        "children": [
          "francis_hamilton_sr"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "jacobina_young_hamilton": {
            "type": "marriage",
            "confidence": "medium"
          }
        },
        "child": {
          "francis_hamilton_sr": {
            "type": "biological",
            "confidence": "medium"
          }
        }
      },
      "notes": "Lawyer and clerk to regality of Mauchline, Scotland. Father of Francis Hamilton Sr. Per FW_ Jefferson County.eml.",
      "confidence": "medium"
    },
    {
      "id": "jacobina_young_hamilton",
      "name": {
        "full": "Jacobina Young Hamilton"
      },
      "lifespan": {
        "born": {
          "place": "Scotland"
        }
      },
      "relationships": {
        "spouses": [
          "john_hamilton_of_kype"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "john_hamilton_of_kype": {
            "type": "marriage",
            "confidence": "medium"
          }
        }
      },
      "confidence": "low"
    },
    {
      "id": "francis_hamilton_sr",
      "name": {
        "full": "Francis Hamilton Sr."
      },
      "lifespan": {
        "born": {
          "date": "~1743",
          "place": "Scotland (emigrated to Harpers Ferry, WV)"
        }
      },
      "relationships": {
        "parents": [
          "john_hamilton_of_kype",
          "jacobina_young_hamilton"
        ],
        "children": [
          "elizabeth_eliza_hamilton"
        ]
      },
      "relationships_meta": {
        "child": {
          "elizabeth_eliza_hamilton": {
            "type": "biological",
            "confidence": "medium"
          }
        }
      },
      "place_history": [
        {
          "type": "residence",
          "place": "Harpers Ferry, WV",
          "date": "~1780s-1830s",
          "evidence": "Here's some info for your trip..eml — family owned foundry in Harpers Ferry",
          "confidence": "medium"
        }
      ],
      "notes": "Per Dale Morrow research (AdamsFamilyDoc_searchable.pdf). CONFLICT RESOLVED: Early sources suggested Gavin Hamilton was father of Francis and Eliza; resolved by Re_ Jefferson County.eml — Francis and Eliza are children of Francis son of John Hamilton of Kype, NOT Gavin Hamilton of Mauchline. Other child: Francis Hamilton Jr. (note only, no separate node).",
      "confidence": "medium"
    },
    {
      "id": "dielman_edward_kolb",
      "name": {
        "full": "Dielman Edward Kolb"
      },
      "lifespan": {
        "born": {
          "date": "1648",
          "place": "Wolfsheim, Baden, Germany"
        },
        "died": {
          "date": "1712",
          "place": "Palatinate, Germany (buried Manheim)"
        }
      },
      "relationships": {
        "spouses": [
          "agnes_schumacher_kolb"
        ],
        "children": [
          "henry_kolb"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "agnes_schumacher_kolb": {
            "type": "marriage",
            "confidence": "medium"
          }
        },
        "child": {
          "henry_kolb": {
            "type": "biological",
            "confidence": "medium"
          }
        }
      },
      "place_history": [
        {
          "type": "residence",
          "place": "Wolfsheim, Baden, Germany",
          "date_range": "1648-1712",
          "evidence": "Kulp Lineage Notes.eml (Irma Zacher)",
          "confidence": "medium"
        }
      ],
      "notes": "Ancestor of the Kulp lineage. Name variants: Kolb, Kolp, Culp, Kulp. Kulp Lineage Notes.eml.",
      "confidence": "medium"
    },
    {
      "id": "agnes_schumacher_kolb",
      "name": {
        "full": "Agnes Schumacher Kolb"
      },
      "lifespan": {
        "born": {
          "date": "1652",
          "place": "Wolfsheim, Germany"
        },
        "died": {
          "date": "1705-02-07",
          "place": "Wolfsheim, Germany"
        }
      },
      "relationships": {
        "spouses": [
          "dielman_edward_kolb"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "dielman_edward_kolb": {
            "type": "marriage",
            "confidence": "medium"
          }
        }
      },
      "confidence": "medium"
    },
    {
      "id": "henry_kolb",
      "name": {
        "full": "Henry Kolb"
      },
      "lifespan": {
        "born": {
          "date": "~1679",
          "place": "Baden, Württemberg, Germany"
        },
        "died": {
          "date": "1730-07-18",
          "place": "Skippack, Montgomery Co, PA"
        }
      },
      "relationships": {
        "spouses": [
          "barbara_fretz_kolb"
        ],
        "parents": [
          "dielman_edward_kolb",
          "agnes_schumacher_kolb"
        ],
        "children": [
          "peter_kolb"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "barbara_fretz_kolb": {
            "type": "marriage",
            "confidence": "medium"
          }
        },
        "child": {
          "peter_kolb": {
            "type": "biological",
            "confidence": "medium"
          }
        }
      },
      "place_history": [
        {
          "type": "move",
          "from": "Baden, Württemberg, Germany",
          "to": "Germantown, PA",
          "date": "1707",
          "evidence": "Kulp Lineage Notes.eml — 'Came to America 1707. Settled in Germantown, PA'",
          "confidence": "medium"
        },
        {
          "type": "record",
          "place": "Skippack, Montgomery Co, PA",
          "date": "1730-07-18",
          "evidence": "Kulp Lineage Notes.eml — death record",
          "confidence": "medium"
        }
      ],
      "notes": "Came to America 1707. Kulp Lineage Notes.eml.",
      "confidence": "medium"
    },
    {
      "id": "barbara_fretz_kolb",
      "name": {
        "full": "Barbara Fretz Kolb"
      },
      "relationships": {
        "spouses": [
          "henry_kolb"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "henry_kolb": {
            "type": "marriage",
            "confidence": "medium"
          }
        }
      },
      "confidence": "low"
    },
    {
      "id": "peter_kolb",
      "name": {
        "full": "Peter Kolb"
      },
      "lifespan": {
        "born": {
          "date": "1718",
          "place": "Bebberstown, Montgomery Co, PA"
        },
        "died": {
          "date": "1748",
          "place": "Bebberstown, Montgomery Co, PA"
        }
      },
      "relationships": {
        "spouses": [
          "elizabeth_oberholtzer_kolb"
        ],
        "parents": [
          "henry_kolb",
          "barbara_fretz_kolb"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "elizabeth_oberholtzer_kolb": {
            "type": "marriage",
            "confidence": "medium"
          }
        }
      },
      "notes": "Married Elizabeth Oberholtzer 1748. Children: Jacob, Dorothea, Elizabeth (note only — no separate nodes). NOTE: Connection forward to John Kulp b.~1860 is NOT documented in sources — significant genealogical gap. Do not infer.",
      "confidence": "medium"
    },
    {
      "id": "elizabeth_oberholtzer_kolb",
      "name": {
        "full": "Elizabeth Oberholtzer Kolb"
      },
      "relationships": {
        "spouses": [
          "peter_kolb"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "peter_kolb": {
            "type": "marriage",
            "confidence": "medium"
          }
        }
      },
      "notes": "Married Peter Kolb 1748. Kulp Lineage Notes.eml.",
      "confidence": "low"
    },
    {
      "id": "joseph_mckeldin",
      "name": {
        "full": "Joseph McKeldin"
      },
      "lifespan": {
        "born": {
          "date": "~1779",
          "place": "Ireland"
        },
        "died": {
          "date": "~December 1834"
        }
      },
      "relationships": {
        "spouses": [
          "mary_sinclair_mckeldin"
        ],
        "children": [
          "edward_hazelton_mckeldin"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "mary_sinclair_mckeldin": {
            "type": "marriage",
            "confidence": "medium"
          }
        },
        "child": {
          "edward_hazelton_mckeldin": {
            "type": "biological",
            "confidence": "high"
          }
        }
      },
      "place_history": [
        {
          "type": "move",
          "from": "Ireland",
          "to": "Baltimore, MD",
          "date": "~1800",
          "evidence": "McKeldin_Research.md — 'first generation McKeldin immigrants to settle in Baltimore'",
          "confidence": "medium"
        }
      ],
      "notes": "First-generation McKeldin immigrant to Baltimore. NOTE: Intermediate generations between Joseph McKeldin (~1779) and Charles E. McKeldin I (b.1887) are NOT documented — significant genealogical gap.",
      "confidence": "medium"
    },
    {
      "id": "mary_sinclair_mckeldin",
      "name": {
        "full": "Mary Sinclair McKeldin"
      },
      "lifespan": {
        "born": {
          "date": "~1780",
          "place": "Ireland"
        }
      },
      "relationships": {
        "spouses": [
          "joseph_mckeldin"
        ],
        "children": [
          "edward_hazelton_mckeldin"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "joseph_mckeldin": {
            "type": "marriage",
            "confidence": "medium"
          }
        },
        "child": {
          "edward_hazelton_mckeldin": {
            "type": "biological",
            "confidence": "high"
          }
        }
      },
      "place_history": [
        {
          "type": "move",
          "from": "Ireland",
          "to": "Baltimore, MD",
          "date": "~1800",
          "evidence": "McKeldin_Research.md",
          "confidence": "medium"
        }
      ],
      "confidence": "medium"
    },
    {
      "id": "edward_hazelton_mckeldin",
      "name": {
        "full": "Edward Hazelton McKeldin"
      },
      "lifespan": {
        "born": {
          "date": "~1818",
          "place": "Baltimore, MD"
        },
        "died": {
          "date": "1864-07-09",
          "place": "Baltimore, MD"
        }
      },
      "relationships": {
        "spouses": [
          "sophia_e_selbe"
        ],
        "parents": [
          "joseph_mckeldin",
          "mary_sinclair_mckeldin"
        ],
        "children": [
          "james_alfred_mckeldin"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "sophia_e_selbe": {
            "type": "marriage",
            "confidence": "high"
          }
        },
        "child": {
          "james_alfred_mckeldin": {
            "type": "biological",
            "confidence": "high"
          }
        }
      },
      "notes": "Authorized gap-closure v20: added as son of Joseph McKeldin and Mary Sinclair, and father of James Alfred McKeldin, based on Adams_Family_History.html and McKeldin_Research.md.",
      "confidence": "high",
      "biography": {
        "summary": "Baltimore McKeldin ancestor between Joseph McKeldin and James Alfred McKeldin."
      }
    },
    {
      "id": "sophia_e_selbe",
      "name": {
        "full": "Sophia E. Selbe"
      },
      "lifespan": {
        "born": {
          "date": "1825-03-20",
          "place": "Germany"
        },
        "died": {
          "date": "1891-10-08"
        }
      },
      "relationships": {
        "spouses": [
          "edward_hazelton_mckeldin"
        ],
        "children": [
          "james_alfred_mckeldin"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "edward_hazelton_mckeldin": {
            "type": "marriage",
            "confidence": "high"
          }
        },
        "child": {
          "james_alfred_mckeldin": {
            "type": "biological",
            "confidence": "high"
          }
        }
      },
      "notes": "Authorized gap-closure v20: added as spouse of Edward Hazelton McKeldin and mother of James Alfred McKeldin, based on Adams_Family_History.html and McKeldin_Research.md.",
      "confidence": "high",
      "biography": {
        "summary": "German immigrant McKeldin ancestor identified in the newer McKeldin family synthesis."
      }
    },
    {
      "id": "james_alfred_mckeldin",
      "name": {
        "full": "James Alfred McKeldin"
      },
      "lifespan": {
        "born": {
          "date": "1860-03-29",
          "place": "Baltimore, MD"
        },
        "died": {
          "date": "1923-05-30",
          "place": "Baltimore, MD"
        }
      },
      "relationships": {
        "spouses": [
          "dorothea_grief_mckeldin"
        ],
        "parents": [
          "edward_hazelton_mckeldin",
          "sophia_e_selbe"
        ],
        "children": [
          "charles_e_mckeldin_i",
          "theodore_r_mckeldin"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "dorothea_grief_mckeldin": {
            "type": "marriage",
            "confidence": "high"
          }
        },
        "child": {
          "charles_e_mckeldin_i": {
            "type": "biological",
            "confidence": "medium"
          },
          "theodore_r_mckeldin": {
            "type": "biological",
            "confidence": "high"
          }
        }
      },
      "notes": "Authorized gap-closure v20: added as Brendan's McKeldin ancestor and linked as father of Charles E. McKeldin I and Theodore R. McKeldin, based on McKeldin_Research.md, Adams_Family_History.html, and CopilotFamilyTree.html. Charles E. McKeldin I child-link remains medium confidence because the compiled research labels that great-grandfather placement as a synthesized conclusion rather than a primary record citation.",
      "confidence": "high",
      "biography": {
        "summary": "Baltimore tinsmith / sheet metal worker in Brendan's McKeldin line."
      }
    },
    {
      "id": "dorothea_grief_mckeldin",
      "name": {
        "full": "Dorothea (Grief) McKeldin"
      },
      "lifespan": {
        "born": {
          "date": "1863-07-03"
        },
        "died": {
          "date": "1925-03-05",
          "place": "Baltimore, MD"
        }
      },
      "relationships": {
        "spouses": [
          "james_alfred_mckeldin"
        ],
        "children": [
          "charles_e_mckeldin_i",
          "theodore_r_mckeldin"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "james_alfred_mckeldin": {
            "type": "marriage",
            "confidence": "high"
          }
        },
        "child": {
          "charles_e_mckeldin_i": {
            "type": "biological",
            "confidence": "medium"
          },
          "theodore_r_mckeldin": {
            "type": "biological",
            "confidence": "high"
          }
        }
      },
      "notes": "Authorized gap-closure v20: added as spouse of James Alfred McKeldin and mother of Charles E. McKeldin I and Theodore R. McKeldin, based on McKeldin_Research.md and CopilotFamilyTree.html. Charles E. McKeldin I child-link remains medium confidence for the same reason noted on James Alfred McKeldin.",
      "confidence": "high",
      "biography": {
        "summary": "German-American McKeldin ancestor in Brendan's maternal line."
      }
    },
    {
      "id": "charles_e_mckeldin_i",
      "name": {
        "full": "Charles E. McKeldin I"
      },
      "lifespan": {
        "born": {
          "date": "1887-02-04",
          "place": "Baltimore, MD"
        },
        "died": {
          "date": "1949-02-14",
          "place": "Baltimore, MD"
        }
      },
      "relationships": {
        "spouses": [
          "emma_bell_mckeldin"
        ],
        "children": [
          "charles_buckey_mckeldin_jr",
          "j_michael_mckeldin"
        ],
        "parents": [
          "james_alfred_mckeldin",
          "dorothea_grief_mckeldin"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "emma_bell_mckeldin": {
            "type": "marriage",
            "confidence": "high"
          }
        },
        "child": {
          "charles_buckey_mckeldin_jr": {
            "type": "biological",
            "confidence": "high"
          },
          "j_michael_mckeldin": {
            "type": "biological",
            "confidence": "high"
          }
        }
      },
      "notes": "Brother of Theodore R. McKeldin (Gov. MD / Mayor Baltimore). Source: McKeldin_Research.md (WikiTree + Peggy McKeldin 2008 Baltimore Sun obit). NOTE: Undocumented generations between Joseph McKeldin (~1779) and this person (b.1887). Authorized gap-closure v20: parentage to James Alfred McKeldin and Dorothea (Grief) McKeldin promoted from Adams_Family_History.html, McKeldin_Research.md, and CopilotFamilyTree.html.",
      "confidence": "high"
    },
    {
      "id": "emma_bell_mckeldin",
      "name": {
        "full": "Emma Bell McKeldin"
      },
      "lifespan": {
        "died": {
          "date": "~1948-02"
        }
      },
      "relationships": {
        "spouses": [
          "charles_e_mckeldin_i"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "charles_e_mckeldin_i": {
            "type": "marriage",
            "confidence": "high"
          }
        }
      },
      "notes": "Per Barbara McKeldin Adams memoir p.57 — 'she passed away right after I was born' (Barbara born 1948-02-12). Maiden name unknown — open research item.",
      "confidence": "high"
    },
    {
      "id": "theodore_r_mckeldin",
      "name": {
        "full": "Theodore R. McKeldin"
      },
      "notes": "Governor of Maryland and Mayor of Baltimore. Brother of charles_e_mckeldin_i. COLLATERAL — not a direct ancestor of Brendan McKeldin Adams. McKeldin_Research.md. Authorized gap-closure v20: parentage to James Alfred McKeldin and Dorothea (Grief) McKeldin promoted from McKeldin_Research.md and CopilotFamilyTree.html.",
      "confidence": "high",
      "relationships": {
        "parents": [
          "james_alfred_mckeldin",
          "dorothea_grief_mckeldin"
        ]
      }
    },
    {
      "id": "charles_buckey_mckeldin_jr",
      "name": {
        "full": "Charles 'Buckey' McKeldin Jr."
      },
      "relationships": {
        "spouses": [
          "emily_schriefer_mckeldin",
          "margaret_quinn_mckeldin"
        ],
        "parents": [
          "charles_e_mckeldin_i",
          "emma_bell_mckeldin"
        ],
        "children": [
          "charles_chuck_mckeldin",
          "barbara_mckeldin_adams"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "emily_schriefer_mckeldin": {
            "type": "marriage",
            "confidence": "high"
          },
          "margaret_quinn_mckeldin": {
            "type": "marriage",
            "confidence": "medium"
          }
        },
        "child": {
          "charles_chuck_mckeldin": {
            "type": "biological",
            "confidence": "high"
          },
          "barbara_mckeldin_adams": {
            "type": "biological",
            "confidence": "high"
          }
        }
      },
      "notes": "Referred to as 'Buckey'. Peggy McKeldin 2008 Baltimore Sun obit names children: 'Charles E. McKeldin Jr., Barbara J. Adams, and J. Michael McKeldin.' DOB/DOD unknown — open research item. Reconciliation v19: DOB 1917-04-22 and DOD 2006-08-30 promoted from already-cited corpus.",
      "confidence": "high",
      "lifespan": {
        "born": {
          "date": "1917-04-22"
        },
        "died": {
          "date": "2006-08-30"
        }
      }
    },
    {
      "id": "emily_schriefer_mckeldin",
      "name": {
        "full": "Emily Schriefer McKeldin"
      },
      "lifespan": {
        "died": {
          "date": "1950-04-24"
        }
      },
      "relationships": {
        "spouses": [
          "charles_buckey_mckeldin_jr"
        ],
        "children": [
          "charles_chuck_mckeldin",
          "barbara_mckeldin_adams"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "charles_buckey_mckeldin_jr": {
            "type": "marriage",
            "confidence": "high"
          }
        },
        "child": {
          "charles_chuck_mckeldin": {
            "type": "biological",
            "confidence": "high"
          },
          "barbara_mckeldin_adams": {
            "type": "biological",
            "confidence": "high"
          }
        }
      },
      "notes": "First husband: Jack Poleman (naval aviator KIA D-Day ~1944) — no confirmed children with Poleman. Parents: George Schriefer (d. 1951-05-12) and Ethel Quinn Schriefer (d. 1952-04-12). DOB unknown. Name spelling conflict: 'Schriefer' vs 'Schrieffer' — unresolved. Barbara McKeldin Adams - A Memoir interior.pdf.",
      "confidence": "high"
    },
    {
      "id": "margaret_quinn_mckeldin",
      "name": {
        "full": "Margaret 'Granny' Quinn McKeldin"
      },
      "relationships": {
        "spouses": [
          "charles_buckey_mckeldin_jr"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "charles_buckey_mckeldin_jr": {
            "type": "marriage",
            "confidence": "medium"
          }
        }
      },
      "notes": "Second wife of Buckey McKeldin. Stepmother to Barbara and Chuck. Known as 'Granny'. Brendan McKeldin Adams.docx. Reconciliation v19: Peggy DOB 1927-03-12 and DOD 2008-11-18 promoted from already-cited corpus.",
      "confidence": "medium",
      "lifespan": {
        "born": {
          "date": "1927-03-12"
        },
        "died": {
          "date": "2008-11-18"
        }
      }
    },
    {
      "id": "jack_poleman",
      "name": {
        "full": "Jack Poleman"
      },
      "lifespan": {
        "died": {
          "date": "~1944-06-06"
        }
      },
      "relationships": {
        "spouses": [
          "emily_schriefer_mckeldin"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "emily_schriefer_mckeldin": {
            "type": "marriage",
            "confidence": "medium"
          }
        }
      },
      "notes": "Naval aviator KIA D-Day (~1944). First husband of Emily Schriefer. No confirmed children. Barbara McKeldin Adams - A Memoir interior.pdf.",
      "confidence": "medium"
    },
    {
      "id": "charles_chuck_mckeldin",
      "name": {
        "full": "Charles 'Chuck' McKeldin"
      },
      "lifespan": {
        "born": {
          "date": "~1947-02-04"
        }
      },
      "relationships": {
        "parents": [
          "charles_buckey_mckeldin_jr",
          "emily_schriefer_mckeldin"
        ],
        "spouses": [
          "michelle_mckeldin_spouse"
        ],
        "children": [
          "jennifer_mckeldin",
          "charlie_mckeldin"
        ]
      },
      "notes": "Brother of Barbara and Mike. Married to Michelle McKeldin. Father of Jennifer and Charlie McKeldin.",
      "confidence": "low",
      "relationships_meta": {
        "spouse": {
          "michelle_mckeldin_spouse": {
            "type": "marriage",
            "confidence": "high"
          }
        },
        "child": {
          "jennifer_mckeldin": {
            "type": "biological",
            "confidence": "high"
          },
          "charlie_mckeldin": {
            "type": "biological",
            "confidence": "high"
          }
        }
      }
    },
    {
      "id": "j_michael_mckeldin",
      "name": {
        "full": "J. Michael McKeldin"
      },
      "relationships": {
        "parents": [
          "charles_e_mckeldin_i",
          "emma_bell_mckeldin"
        ]
      },
      "notes": "'Uncle Mike.' DOB unknown — open research item per Adams_Family_History.html. Per Peggy McKeldin 2008 Baltimore Sun obit.",
      "confidence": "low"
    },
    {
      "id": "jose_pierre_adams",
      "name": {
        "full": "Jose Pierre Adams"
      },
      "lifespan": {
        "born": {
          "date": "~1791",
          "place": "Scotland (presumed)"
        },
        "died": {
          "date": "~1836",
          "place": "Licking County, OH (Luray area)"
        }
      },
      "relationships": {
        "spouses": [
          "elizabeth_eliza_hamilton"
        ],
        "children": [
          "george_francis_adams_b1817"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "elizabeth_eliza_hamilton": {
            "type": "marriage",
            "confidence": "medium"
          }
        },
        "child": {
          "george_francis_adams_b1817": {
            "type": "biological",
            "confidence": "medium"
          }
        }
      },
      "place_history": [
        {
          "type": "record",
          "place": "Jefferson County, VA",
          "date": "~1813",
          "evidence": "AdamsFamilyDoc_searchable.pdf — marriage record 1813 Jefferson County VA",
          "confidence": "medium"
        },
        {
          "type": "record",
          "place": "Morgan County, WV",
          "date": "~1820",
          "evidence": "FW_ Random thoughts.eml — 1820 Census Bath/Morgan County",
          "confidence": "medium"
        },
        {
          "type": "move",
          "from": "Jefferson County, VA",
          "to": "Licking County, OH",
          "date": "~1833-1836",
          "evidence": "Fw_ Obituary.eml — family came west ~1833; obit confirms death Licking County OH",
          "confidence": "low"
        }
      ],
      "notes": "Died of accidental poisoning per State Library of Virginia obit (Fw_ Obituary.eml). Origin uncertain — Scotland per family lore; no documentary proof. CONFLICT: some sources record name as 'Jesse P. Adams' (Re_ Family History Library.eml). JQA illegitimate-son lore reported in Here's some info for your trip..eml — NOT encoded as fact (no documentary proof).",
      "confidence": "low"
    },
    {
      "id": "elizabeth_eliza_hamilton",
      "name": {
        "full": "Elizabeth 'Eliza' Hamilton Adams"
      },
      "lifespan": {
        "born": {
          "date": "~1783",
          "place": "Jefferson County, VA"
        }
      },
      "relationships": {
        "spouses": [
          "jose_pierre_adams"
        ],
        "parents": [
          "francis_hamilton_sr"
        ],
        "children": [
          "george_francis_adams_b1817"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "jose_pierre_adams": {
            "type": "marriage",
            "confidence": "medium"
          }
        },
        "child": {
          "george_francis_adams_b1817": {
            "type": "biological",
            "confidence": "medium"
          }
        }
      },
      "notes": "Per 1850 Census born ~1783 Virginia. Daughter of Francis Hamilton Sr. (son of John Hamilton of Kype). Re_ Jefferson County.eml.",
      "confidence": "medium"
    },
    {
      "id": "george_francis_adams_b1817",
      "name": {
        "full": "George Francis Adams"
      },
      "lifespan": {
        "born": {
          "date": "~1817",
          "place": "Harpers Ferry, WV (CONFLICT: death cert via Alberta Allen says Ohio; obit says VA/WV — LOW confidence for birthplace)"
        },
        "died": {
          "date": "~1898",
          "place": "Castle Rock, Douglas County, CO"
        }
      },
      "relationships": {
        "spouses": [
          "cynthia_lane_adams"
        ],
        "parents": [
          "jose_pierre_adams",
          "elizabeth_eliza_hamilton"
        ],
        "children": [
          "john_wesley_adams",
          "alberta_adams_allen",
          "george_washington_adams_collateral"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "cynthia_lane_adams": {
            "type": "marriage",
            "confidence": "high"
          }
        },
        "child": {
          "john_wesley_adams": {
            "type": "biological",
            "confidence": "high"
          },
          "alberta_adams_allen": {
            "type": "biological",
            "confidence": "high"
          },
          "george_washington_adams_collateral": {
            "type": "biological",
            "confidence": "high"
          }
        }
      },
      "place_history": [
        {
          "type": "record",
          "place": "Chariton County, MO",
          "date_range": "~1840s-1880s",
          "evidence": "FW_ Chariton County 1880.eml — farming south of county near Keytesville",
          "confidence": "high"
        },
        {
          "type": "move",
          "from": "Missouri",
          "to": "Colorado",
          "date": "~1883",
          "evidence": "FW_ Chariton County 1880.eml — 'by the time this map was made George F. and family had moved to Colorado'",
          "confidence": "high"
        },
        {
          "type": "record",
          "place": "Castle Rock, Douglas County, CO",
          "evidence": "Fw_ Colorado Adams.eml — buried Cedar Hill Cemetery; CSA marker placed 2011-11-11",
          "confidence": "high"
        }
      ],
      "notes": "BIRTHPLACE LOW CONFIDENCE. Buried Cedar Hill Cemetery, Castle Rock CO. Served Confederate Army and multiple conflicts 1836-1865 (Fw_ Colorado Adams.eml). Land patents signed by Presidents Fillmore and Buchanan (Adams Documents.eml). CONFLICT: birthplace — Alberta Allen listed Ohio on John W. Adams death cert; family/obit say VA/WV. Other children not separately encoded (dates unknown): Charles, William Wallace, Gertrude, Myrtle, Mary Susan — per AdamsFamilyDoc.",
      "confidence": "high",
      "biography": {
        "summary": "Known as GFA I. Confederate veteran. Moved family Missouri→Colorado ~1883. Buried Castle Rock CO."
      }
    },
    {
      "id": "cynthia_lane_adams",
      "name": {
        "full": "Cynthia Lane Adams"
      },
      "relationships": {
        "spouses": [
          "george_francis_adams_b1817"
        ],
        "children": [
          "john_wesley_adams",
          "alberta_adams_allen",
          "george_washington_adams_collateral"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "george_francis_adams_b1817": {
            "type": "marriage",
            "confidence": "high"
          }
        },
        "child": {
          "john_wesley_adams": {
            "type": "biological",
            "confidence": "high"
          },
          "alberta_adams_allen": {
            "type": "biological",
            "confidence": "high"
          },
          "george_washington_adams_collateral": {
            "type": "biological",
            "confidence": "high"
          }
        }
      },
      "place_history": [
        {
          "type": "move",
          "from": "West Virginia",
          "to": "Chariton County, MO",
          "date": "~1840s",
          "evidence": "Re_ Genealogy.eml — 'George F. and Cynthia Lane Adams, who came to Missouri from West Virginia'",
          "confidence": "high"
        }
      ],
      "notes": "Daughter of John Lane per Adams Documents.eml. DOB/DOD unknown.",
      "confidence": "medium"
    },
    {
      "id": "john_wesley_adams",
      "name": {
        "full": "John Wesley Adams"
      },
      "lifespan": {
        "born": {
          "date": "1841-09",
          "place": "Missouri"
        },
        "died": {
          "date": "1920-11-14",
          "place": "Benton, Benton County, AR"
        }
      },
      "relationships": {
        "spouses": [
          "mary_frances_vantyne_clark_adams"
        ],
        "parents": [
          "george_francis_adams_b1817",
          "cynthia_lane_adams"
        ],
        "children": [
          "george_francis_adams_b1876",
          "alberta_adams_allen"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "mary_frances_vantyne_clark_adams": {
            "type": "marriage",
            "confidence": "high"
          }
        },
        "child": {
          "george_francis_adams_b1876": {
            "type": "biological",
            "confidence": "high"
          },
          "alberta_adams_allen": {
            "type": "biological",
            "confidence": "high"
          }
        }
      },
      "place_history": [
        {
          "type": "record",
          "place": "Chariton County, MO",
          "date_range": "~1860s-1880s",
          "evidence": "FW_ Chariton County 1880.eml — John managing farm after GFA I moved to Colorado",
          "confidence": "high"
        },
        {
          "type": "record",
          "place": "Denver, CO",
          "evidence": "Adams_Family_History.html — census trail frontier man",
          "confidence": "medium"
        },
        {
          "type": "record",
          "place": "Multnomah County, OR",
          "evidence": "Adams_Family_History.html — census trail Oregon",
          "confidence": "medium"
        },
        {
          "type": "record",
          "place": "Benton County, AR",
          "evidence": "RE_ Trip to Trudy's.eml — died Benton County AR November 1920",
          "confidence": "high"
        }
      ],
      "notes": "Eldest son of GFA I. Death cert signed by daughter Alberta Allen. Alberta listed GFA I birthplace Ohio — likely error per George F. Adams III email (RE_ Trip to Trudy's.eml). Other children not separately encoded: Myrtle (Urbach branch), others per AdamsFamilyDoc.",
      "confidence": "high"
    },
    {
      "id": "mary_frances_vantyne_clark_adams",
      "name": {
        "full": "Mary Frances VanTyne (Clark) Adams"
      },
      "relationships": {
        "spouses": [
          "john_wesley_adams"
        ],
        "children": [
          "george_francis_adams_b1876"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "john_wesley_adams": {
            "type": "marriage",
            "confidence": "high"
          }
        },
        "child": {
          "george_francis_adams_b1876": {
            "type": "biological",
            "confidence": "medium"
          }
        }
      },
      "notes": "Had son Clay C. Clark by first husband Ephraim Clark (married ~age 15; Ephraim died end of Civil War ~1865). Clay adopted by Willett family until age 18. John Wesley Adams married Mary after she turned 18. FW_ Chariton County 1880.eml.",
      "confidence": "low"
    },
    {
      "id": "alberta_adams_allen",
      "name": {
        "full": "Alberta Adams Allen"
      },
      "relationships": {
        "parents": [
          "george_francis_adams_b1817",
          "cynthia_lane_adams"
        ]
      },
      "notes": "Daughter of GFA I; older sister of GFA II. Informant on John Wesley Adams death cert. Married into Allen line — ancestor of Bill Allen (genealogy researcher). Per Re_ Genealogy.eml. DOB/DOD unknown.",
      "confidence": "medium"
    },
    {
      "id": "george_washington_adams_collateral",
      "name": {
        "full": "George Washington Adams"
      },
      "relationships": {
        "parents": [
          "george_francis_adams_b1817",
          "cynthia_lane_adams"
        ]
      },
      "notes": "Per Irma Zacher Note from Cuz Irma.eml (Ancestry.com) — 'son of George Francis Adams, brother of John Sr. Adams.' COLLATERAL — not on direct line to Brendan McKeldin Adams. LOW CONFIDENCE — single Ancestry.com source; Irma noted possible transcription errors.",
      "confidence": "low"
    },
    {
      "id": "george_francis_adams_b1876",
      "name": {
        "full": "George Francis 'J. Francis' Adams"
      },
      "lifespan": {
        "born": {
          "date": "1876-08",
          "place": "Oregon"
        },
        "died": {
          "date": "~1920-02-07"
        }
      },
      "relationships": {
        "spouses": [
          "serena_trumbo_adams"
        ],
        "parents": [
          "john_wesley_adams",
          "mary_frances_vantyne_clark_adams"
        ],
        "children": [
          "george_francis_adams_sr"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "serena_trumbo_adams": {
            "type": "marriage",
            "confidence": "high"
          }
        },
        "child": {
          "george_francis_adams_sr": {
            "type": "biological",
            "confidence": "high"
          }
        }
      },
      "place_history": [
        {
          "type": "record",
          "place": "Douglas County, OR",
          "date": "~1916-1920",
          "evidence": "RE_ Genealogy Tidbit.eml — 1920 Census Douglas County OR; Oregon birth certs",
          "confidence": "high"
        },
        {
          "type": "record",
          "place": "Denver, CO",
          "date": "1898",
          "evidence": "Re_ Genealogy .eml — served military 1898 in Denver",
          "confidence": "high"
        }
      ],
      "notes": "BIRTH NAME: Edward G. Adams per 1920 Census. Renamed George F. by mother 'Neenie' (Serena Trumbo) after grandfather GFA I died. Oregon birth certificates exist for BOTH 'Edward G.' and 'George F.' names. DEATH DATE: NARD Journal obit published March 18, 1920 — death ~Feb 7, 1920, NOT 1918 (Trudy's recollection of 1918 contradicted by obit publication date per RE_ Genealogy Tidbit[1].eml). Served military 1898 Denver (no branch specified).",
      "confidence": "high"
    },
    {
      "id": "serena_trumbo_adams",
      "name": {
        "full": "Serena 'Neenie' Trumbo Adams"
      },
      "relationships": {
        "spouses": [
          "george_francis_adams_b1876"
        ],
        "children": [
          "george_francis_adams_sr"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "george_francis_adams_b1876": {
            "type": "marriage",
            "confidence": "high"
          }
        },
        "child": {
          "george_francis_adams_sr": {
            "type": "biological",
            "confidence": "high"
          }
        }
      },
      "notes": "Changed son's birth name from Edward G. to George F. after husband died. Father possibly George Trumbo who worked in pharmacy with GFA II per RE_ Genealogy Tidbit[1].eml. DOB/DOD unknown.",
      "confidence": "low"
    },
    {
      "id": "john_b_mcphail",
      "name": {
        "full": "John B. McPhail"
      },
      "lifespan": {
        "born": {
          "date": "~1850"
        }
      },
      "relationships": {
        "spouses": [
          "ellen_r_mcphail"
        ],
        "children": [
          "mary_mcphail_kulp"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "ellen_r_mcphail": {
            "type": "marriage",
            "confidence": "medium"
          }
        },
        "child": {
          "mary_mcphail_kulp": {
            "type": "biological",
            "confidence": "medium"
          }
        }
      },
      "notes": "1910 Census Whatcom County WA — neighbor to Aaron Simons and John Kulp farms. Re_ Simons-Notes from Cuz Irma.eml.",
      "confidence": "medium"
    },
    {
      "id": "ellen_r_mcphail",
      "name": {
        "full": "Ellen R. McPhail"
      },
      "lifespan": {
        "born": {
          "date": "~1851"
        }
      },
      "relationships": {
        "spouses": [
          "john_b_mcphail"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "john_b_mcphail": {
            "type": "marriage",
            "confidence": "medium"
          }
        }
      },
      "confidence": "medium"
    },
    {
      "id": "john_kulp",
      "name": {
        "full": "John Kulp"
      },
      "lifespan": {
        "born": {
          "date": "~1860"
        }
      },
      "relationships": {
        "spouses": [
          "mary_mcphail_kulp"
        ],
        "children": [
          "dradie_ellen_kulp_simons"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "mary_mcphail_kulp": {
            "type": "marriage",
            "confidence": "high"
          }
        },
        "child": {
          "dradie_ellen_kulp_simons": {
            "type": "biological",
            "confidence": "high"
          }
        }
      },
      "place_history": [
        {
          "type": "residence",
          "place": "Whatcom County, WA",
          "date_range": "~1898-~1913",
          "evidence": "Re_ You home_ Yes--I am-Hi Cuz.eml — 10 Kulp children; first 8 born Whatcom County",
          "confidence": "high"
        },
        {
          "type": "move",
          "from": "Whatcom County, WA",
          "to": "Shragg, Adams County, WA",
          "date": "~1913-1916",
          "evidence": "Re_ You home_ Yes--I am-Hi Cuz.eml — 'sold farm in Whatcom Co and migrated to Shragg Adams Co WA'",
          "confidence": "high"
        },
        {
          "type": "move",
          "from": "Shragg, Adams County, WA",
          "to": "Albion, WA",
          "date": "~1916",
          "evidence": "Re_ You home_ Yes--I am-Hi Cuz.eml",
          "confidence": "high"
        }
      ],
      "notes": "Name variants: Kolb, Kolp, Culp, Kulp. Ten children total — first 8 born Whatcom County WA; last 3 born eastern WA. Only direct-line child dradie_ellen_kulp_simons encoded separately. NOTE: Connection from Peter Kolb (d.1748) to John Kulp (~1860) is NOT documented — significant gap.",
      "confidence": "medium"
    },
    {
      "id": "mary_mcphail_kulp",
      "name": {
        "full": "Mary McPhail Kulp"
      },
      "lifespan": {
        "born": {
          "date": "~1878"
        },
        "died": {
          "date": "1931-05-30"
        }
      },
      "relationships": {
        "spouses": [
          "john_kulp"
        ],
        "parents": [
          "john_b_mcphail",
          "ellen_r_mcphail"
        ],
        "children": [
          "dradie_ellen_kulp_simons"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "john_kulp": {
            "type": "marriage",
            "confidence": "high"
          }
        },
        "child": {
          "dradie_ellen_kulp_simons": {
            "type": "biological",
            "confidence": "high"
          }
        }
      },
      "notes": "Moved to eastern WA for drier climate. Re_ You home_ Yes--I am-Hi Cuz.eml.",
      "confidence": "medium"
    },
    {
      "id": "aaron_simons",
      "name": {
        "full": "Aaron Simons"
      },
      "relationships": {
        "spouses": [
          "harriet_hattie_simons"
        ],
        "children": [
          "ray_zelmon_simons"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "harriet_hattie_simons": {
            "type": "marriage",
            "confidence": "medium"
          }
        },
        "child": {
          "ray_zelmon_simons": {
            "type": "biological",
            "confidence": "medium"
          }
        }
      },
      "notes": "1910 Census Whatcom County WA. Simons-Notes from Cuz Irma.eml.",
      "confidence": "medium"
    },
    {
      "id": "harriet_hattie_simons",
      "name": {
        "full": "Harriet 'Hattie' Simons"
      },
      "relationships": {
        "spouses": [
          "aaron_simons"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "aaron_simons": {
            "type": "marriage",
            "confidence": "medium"
          }
        }
      },
      "confidence": "low"
    },
    {
      "id": "ray_zelmon_simons",
      "name": {
        "full": "Ray Zelmon Simons"
      },
      "lifespan": {
        "born": {
          "date": "~1898"
        }
      },
      "relationships": {
        "spouses": [
          "dradie_ellen_kulp_simons"
        ],
        "parents": [
          "aaron_simons",
          "harriet_hattie_simons"
        ],
        "children": [
          "beryl_eva_simons_adams",
          "byron_howard_simons",
          "glen_simons"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "dradie_ellen_kulp_simons": {
            "type": "marriage",
            "confidence": "high"
          }
        },
        "child": {
          "beryl_eva_simons_adams": {
            "type": "biological",
            "confidence": "medium"
          },
          "byron_howard_simons": {
            "type": "biological",
            "confidence": "medium"
          },
          "glen_simons": {
            "type": "biological",
            "confidence": "medium"
          }
        }
      },
      "place_history": [
        {
          "type": "event",
          "place": "Ritzville, Adams County, WA",
          "date": "1915-12",
          "evidence": "Re_ You home_ Yes--I am-Hi Cuz.eml — married Dradie December 1915 Ritzville",
          "confidence": "high"
        }
      ],
      "notes": "Ancestry shows conflicting birth/death dates per Irma Zacher (Simons-Notes from Cuz Irma.eml) — possible disambiguation issue (another Raymond Simons?). 1910 Census shows Ray age 12 as neighbor to Dradie Kulp age 11. Other children: Sharon Simons Thompson (noted, not encoded).",
      "confidence": "medium"
    },
    {
      "id": "dradie_ellen_kulp_simons",
      "name": {
        "full": "Dradie Ellen Kulp Simons"
      },
      "lifespan": {
        "born": {
          "date": "1898-05-05",
          "place": "Whatcom County, WA"
        },
        "died": {
          "date": "1978-09-12"
        }
      },
      "relationships": {
        "spouses": [
          "ray_zelmon_simons"
        ],
        "parents": [
          "john_kulp",
          "mary_mcphail_kulp"
        ],
        "children": [
          "beryl_eva_simons_adams",
          "byron_howard_simons",
          "glen_simons"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "ray_zelmon_simons": {
            "type": "marriage",
            "confidence": "high"
          }
        },
        "child": {
          "beryl_eva_simons_adams": {
            "type": "biological",
            "confidence": "medium"
          },
          "byron_howard_simons": {
            "type": "biological",
            "confidence": "medium"
          },
          "glen_simons": {
            "type": "biological",
            "confidence": "medium"
          }
        }
      },
      "place_history": [
        {
          "type": "event",
          "place": "Ritzville, Adams County, WA",
          "date": "1915-12",
          "evidence": "Re_ You home_ Yes--I am-Hi Cuz.eml — married Ray Simons December 1915 Ritzville",
          "confidence": "high"
        }
      ],
      "notes": "Daughter of John and Mary Kulp. Re_ You home_ Yes--I am-Hi Cuz.eml. Reconciliation v19: exact DOB 1898-05-05 and DOD 1978-09-12 promoted from already-cited corpus.",
      "confidence": "high"
    },
    {
      "id": "byron_howard_simons",
      "name": {
        "full": "Byron Daniel 'Howard' Simons"
      },
      "relationships": {
        "parents": [
          "ray_zelmon_simons",
          "dradie_ellen_kulp_simons"
        ]
      },
      "notes": "Beryl Eva Simons Adams' favorite brother. John Howard Adams named 'Howard' after him. Memoir_Life_Timelines.md.",
      "confidence": "medium"
    },
    {
      "id": "glen_simons",
      "name": {
        "full": "Glen Simons"
      },
      "relationships": {
        "parents": [
          "ray_zelmon_simons",
          "dradie_ellen_kulp_simons"
        ]
      },
      "notes": "DNA research contact (23andMe). Adams_DNA_Linkage.md — every match sharing DNA with Glen is on the paternal-grandmother (Simons) branch.",
      "confidence": "medium"
    },
    {
      "id": "george_francis_adams_sr",
      "name": {
        "full": "George Francis Adams Sr."
      },
      "lifespan": {
        "born": {
          "date": "1916-03-10",
          "place": "Oregon"
        },
        "died": {
          "date": "1980-10-11"
        }
      },
      "relationships": {
        "spouses": [
          "beryl_eva_simons_adams"
        ],
        "parents": [
          "george_francis_adams_b1876",
          "serena_trumbo_adams"
        ],
        "children": [
          "gertrude_trudy_adams",
          "john_howard_adams",
          "george_francis_adams_jr"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "beryl_eva_simons_adams": {
            "type": "marriage",
            "confidence": "high"
          }
        },
        "child": {
          "gertrude_trudy_adams": {
            "type": "biological",
            "confidence": "high"
          },
          "john_howard_adams": {
            "type": "biological",
            "confidence": "high"
          },
          "george_francis_adams_jr": {
            "type": "biological",
            "confidence": "high"
          }
        }
      },
      "place_history": [
        {
          "type": "record",
          "place": "Presidio, San Francisco, CA",
          "date_range": "~1950s",
          "evidence": "Memoir_Life_Timelines.md — family life at the Presidio in the 1950s",
          "confidence": "medium"
        },
        {
          "type": "record",
          "place": "Augusta, GA (Fort Gordon)",
          "date": "~1958",
          "evidence": "Memoir_Life_Timelines.md — Fort Gordon MP school",
          "confidence": "high"
        },
        {
          "type": "record",
          "place": "Frankfurt/Heidelberg, Germany",
          "date_range": "1958-1962",
          "evidence": "Memoir_Life_Timelines.md — posted abroad 1958-1962",
          "confidence": "high"
        }
      ],
      "notes": "Born as 'Edward G. Adams' per 1920 Census; name changed by mother Neenie to George Francis Sr. Oregon birth certs for both names exist. CopilotFamilyTree.html.",
      "confidence": "high"
    },
    {
      "id": "beryl_eva_simons_adams",
      "name": {
        "full": "Beryl Eva Simons Adams"
      },
      "relationships": {
        "spouses": [
          "george_francis_adams_sr"
        ],
        "parents": [
          "ray_zelmon_simons",
          "dradie_ellen_kulp_simons"
        ],
        "children": [
          "gertrude_trudy_adams",
          "john_howard_adams",
          "george_francis_adams_jr"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "george_francis_adams_sr": {
            "type": "marriage",
            "confidence": "high"
          }
        },
        "child": {
          "gertrude_trudy_adams": {
            "type": "biological",
            "confidence": "high"
          },
          "john_howard_adams": {
            "type": "biological",
            "confidence": "high"
          },
          "george_francis_adams_jr": {
            "type": "biological",
            "confidence": "high"
          }
        }
      },
      "notes": "Daughter of Ray Zelmon Simons and Dradie Ellen Kulp Simons. Favorite brother: Byron Daniel 'Howard' Simons. Memoir_Life_Timelines.md. Reconciliation v19: DOB 1919-12-25 promoted from already-cited corpus; ambiguous death remains unencoded.",
      "confidence": "high",
      "lifespan": {
        "born": {
          "date": "1919-12-25"
        }
      }
    },
    {
      "id": "gertrude_trudy_adams",
      "name": {
        "full": "Gertrude Elaine 'Trudy' Adams"
      },
      "lifespan": {
        "born": {
          "date": "1944-09-25"
        },
        "died": {
          "date": "2025-07-31"
        }
      },
      "relationships": {
        "spouses": [
          "michael_remy"
        ],
        "parents": [
          "george_francis_adams_sr",
          "beryl_eva_simons_adams"
        ],
        "children": [
          "christopher_chris_remy",
          "camille_cami_remy_obad"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "michael_remy": {
            "type": "marriage",
            "confidence": "medium"
          }
        },
        "child": {
          "christopher_chris_remy": {
            "type": "biological",
            "confidence": "high"
          },
          "camille_cami_remy_obad": {
            "type": "biological",
            "confidence": "high"
          }
        }
      },
      "notes": "CopilotFamilyTree.html. Trudy's recollection that GFA II died 1918 contradicted by NARD Journal obit (published March 1920).",
      "confidence": "high"
    },
    {
      "id": "michael_remy",
      "name": {
        "full": "Michael Remy"
      },
      "relationships": {
        "spouses": [
          "gertrude_trudy_adams"
        ],
        "children": [
          "christopher_chris_remy",
          "camille_cami_remy_obad"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "gertrude_trudy_adams": {
            "type": "marriage",
            "confidence": "medium"
          }
        },
        "child": {
          "christopher_chris_remy": {
            "type": "biological",
            "confidence": "high"
          },
          "camille_cami_remy_obad": {
            "type": "biological",
            "confidence": "high"
          }
        }
      },
      "notes": "Vitals and birthplace unknown. Open research item per Adams_DirectLine.json and Adams_Family_History.html.",
      "confidence": "low"
    },
    {
      "id": "christopher_chris_remy",
      "name": {
        "full": "Christopher 'Chris' Remy"
      },
      "lifespan": {
        "born": {
          "date": "~1968"
        },
        "died": {
          "date": "1984-09"
        }
      },
      "relationships": {
        "parents": [
          "gertrude_trudy_adams",
          "michael_remy"
        ]
      },
      "notes": "Died September 1984. CopilotFamilyTree.html.",
      "confidence": "medium"
    },
    {
      "id": "camille_cami_remy_obad",
      "name": {
        "full": "Camille 'Cami' Remy Obad"
      },
      "lifespan": {
        "born": {
          "date": "1971-10-20"
        }
      },
      "relationships": {
        "parents": [
          "gertrude_trudy_adams",
          "michael_remy"
        ],
        "children": [
          "mateo_vlaho_obad",
          "gabriel_michael_obad",
          "alina_camille_obad"
        ]
      },
      "relationships_meta": {
        "child": {
          "mateo_vlaho_obad": {
            "type": "biological",
            "confidence": "high"
          },
          "gabriel_michael_obad": {
            "type": "biological",
            "confidence": "high"
          },
          "alina_camille_obad": {
            "type": "biological",
            "confidence": "high"
          }
        }
      },
      "notes": "CopilotFamilyTree.html. Spouse not named in sources.",
      "confidence": "high"
    },
    {
      "id": "mateo_vlaho_obad",
      "name": {
        "full": "Mateo Vlaho Obad"
      },
      "lifespan": {
        "born": {
          "date": "2002-02-26"
        }
      },
      "relationships": {
        "parents": [
          "camille_cami_remy_obad"
        ]
      },
      "confidence": "high"
    },
    {
      "id": "gabriel_michael_obad",
      "name": {
        "full": "Gabriel Michael Obad"
      },
      "lifespan": {
        "born": {
          "date": "2007-03-09"
        }
      },
      "relationships": {
        "parents": [
          "camille_cami_remy_obad"
        ]
      },
      "confidence": "high"
    },
    {
      "id": "alina_camille_obad",
      "name": {
        "full": "Alina Camille Obad"
      },
      "lifespan": {
        "born": {
          "date": "2008-12-09"
        }
      },
      "relationships": {
        "parents": [
          "camille_cami_remy_obad"
        ]
      },
      "confidence": "high"
    },
    {
      "id": "john_howard_adams",
      "name": {
        "full": "John Howard Adams"
      },
      "lifespan": {
        "born": {
          "date": "1948-02-24"
        }
      },
      "relationships": {
        "spouses": [
          "barbara_mckeldin_adams"
        ],
        "parents": [
          "george_francis_adams_sr",
          "beryl_eva_simons_adams"
        ],
        "children": [
          "brian_john_adams",
          "brendan_mckeldin_adams"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "barbara_mckeldin_adams": {
            "type": "marriage",
            "confidence": "high"
          }
        },
        "child": {
          "brian_john_adams": {
            "type": "biological",
            "confidence": "high"
          },
          "brendan_mckeldin_adams": {
            "type": "biological",
            "confidence": "high"
          }
        }
      },
      "place_history": [
        {
          "type": "record",
          "place": "Okinawa",
          "date": "~1952",
          "evidence": "Memoir_Life_Timelines.md — 'First big trip to Okinawa'",
          "confidence": "medium"
        },
        {
          "type": "residence",
          "place": "Presidio, San Francisco, CA",
          "date_range": "~1950s",
          "evidence": "Memoir_Life_Timelines.md",
          "confidence": "medium"
        },
        {
          "type": "record",
          "place": "Augusta, GA (Fort Gordon)",
          "date": "~1958",
          "evidence": "Memoir_Life_Timelines.md — Fort Gordon MP school",
          "confidence": "high"
        },
        {
          "type": "record",
          "place": "Frankfurt/Heidelberg, Germany",
          "date_range": "1958-1962",
          "evidence": "Memoir_Life_Timelines.md — father posted abroad",
          "confidence": "high"
        },
        {
          "type": "event",
          "place": "Annapolis, MD",
          "date": "1970-01-31",
          "evidence": "Brendan McKeldin Adams.docx — married Barbara McKeldin in Annapolis MD",
          "confidence": "high"
        },
        {
          "type": "residence",
          "place": "Ridgefield",
          "date": "post-2010",
          "evidence": "John Howard Adams - A Memoir interior.pdf — 'Soon after we arrived in Ridgefield in 2010'",
          "confidence": "high"
        }
      ],
      "notes": "Named 'John' probably after John Kulp or John Wesley Adams; 'Howard' after Beryl's favorite brother Byron Daniel 'Howard' Simons. Memoir_Life_Timelines.md. Married Barbara McKeldin January 31, 1970, Annapolis, MD.",
      "confidence": "high",
      "biography": {
        "summary": "Memoir author. Paternal father of Brendan McKeldin Adams."
      }
    },
    {
      "id": "barbara_mckeldin_adams",
      "name": {
        "full": "Barbara J. McKeldin Adams"
      },
      "lifespan": {
        "born": {
          "date": "1948-02-12",
          "place": "Baltimore, MD"
        }
      },
      "relationships": {
        "spouses": [
          "john_howard_adams"
        ],
        "parents": [
          "charles_buckey_mckeldin_jr",
          "emily_schriefer_mckeldin"
        ],
        "children": [
          "brian_john_adams",
          "brendan_mckeldin_adams"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "john_howard_adams": {
            "type": "marriage",
            "confidence": "high"
          }
        },
        "child": {
          "brian_john_adams": {
            "type": "biological",
            "confidence": "high"
          },
          "brendan_mckeldin_adams": {
            "type": "biological",
            "confidence": "high"
          }
        }
      },
      "place_history": [
        {
          "type": "residence",
          "place": "Baltimore, MD",
          "date_range": "1948-~1968",
          "evidence": "Barbara McKeldin Adams - A Memoir interior.pdf",
          "confidence": "high"
        },
        {
          "type": "event",
          "place": "Annapolis, MD",
          "date": "1970-01-31",
          "evidence": "Brendan McKeldin Adams.docx — married John Howard Adams in Annapolis MD",
          "confidence": "high"
        }
      ],
      "notes": "Mother Emily died 1950-04-24. Raised partly at maternal grandparents', then stepmother Margaret Quinn ('Granny'). Attended Mercy High School Baltimore. Memoir author. Paternal grandmother Emma Bell McKeldin died ~Feb 1948 per memoir. Maternal grandparents: George Schriefer (d. 1951-05-12) and Ethel Quinn Schriefer (d. 1952-04-12).",
      "confidence": "high",
      "biography": {
        "summary": "Memoir author. Maternal mother of Brendan McKeldin Adams."
      }
    },
    {
      "id": "brian_john_adams",
      "name": {
        "full": "Brian John Adams"
      },
      "lifespan": {
        "born": {
          "date": "1972-02-08",
          "place": "Meridian, MS"
        }
      },
      "relationships": {
        "spouses": [
          "michelle_ellis_adams"
        ],
        "parents": [
          "john_howard_adams",
          "barbara_mckeldin_adams"
        ],
        "children": [
          "ethan_adams",
          "gabrielle_adams",
          "lauren_adams",
          "gavin_adams"
        ]
      },
      "notes": "Born 1972-02-08 in Meridian, MS. Married to Michelle Ellis Adams. Father of Ethan, Gabrielle, Lauren, and Gavin Adams.",
      "confidence": "high",
      "relationships_meta": {
        "spouse": {
          "michelle_ellis_adams": {
            "type": "marriage",
            "confidence": "high"
          }
        },
        "child": {
          "ethan_adams": {
            "type": "biological",
            "confidence": "high"
          },
          "gabrielle_adams": {
            "type": "biological",
            "confidence": "high"
          },
          "lauren_adams": {
            "type": "biological",
            "confidence": "high"
          },
          "gavin_adams": {
            "type": "biological",
            "confidence": "high"
          }
        }
      }
    },
    {
      "id": "brendan_mckeldin_adams",
      "name": {
        "full": "Brendan McKeldin Adams"
      },
      "lifespan": {
        "born": {
          "date": "1975-08-01"
        }
      },
      "relationships": {
        "parents": [
          "john_howard_adams",
          "barbara_mckeldin_adams"
        ],
        "spouses": [
          "megan_marie_falde_adams"
        ],
        "children": [
          "garret_adams",
          "owen_adams"
        ]
      },
      "place_history": [
        {
          "type": "residence",
          "place": "Littleton, CO",
          "evidence": "User profile — Office Location Littleton CO",
          "confidence": "high"
        }
      ],
      "notes": "PRIMARY SUBJECT. Born 1975-08-01. Married to Megan Marie (Falde) Adams. Father of Garret and Owen Adams.",
      "confidence": "high",
      "biography": {
        "summary": "Primary subject of this genealogical dataset."
      },
      "relationships_meta": {
        "spouse": {
          "megan_marie_falde_adams": {
            "type": "marriage",
            "confidence": "high"
          }
        },
        "child": {
          "garret_adams": {
            "type": "biological",
            "confidence": "high"
          },
          "owen_adams": {
            "type": "biological",
            "confidence": "high"
          }
        }
      }
    },
    {
      "id": "megan_marie_falde_adams",
      "name": {
        "full": "Megan Marie Falde Adams"
      },
      "lifespan": {
        "born": {
          "date": "1975-12-17"
        }
      },
      "relationships": {
        "spouses": [
          "brendan_mckeldin_adams"
        ],
        "children": [
          "garret_adams",
          "owen_adams"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "brendan_mckeldin_adams": {
            "type": "marriage",
            "confidence": "high"
          }
        },
        "child": {
          "garret_adams": {
            "type": "biological",
            "confidence": "high"
          },
          "owen_adams": {
            "type": "biological",
            "confidence": "high"
          }
        }
      },
      "confidence": "high",
      "notes": "Born 1975-12-17. Married to Brendan McKeldin Adams. Mother of Garret and Owen Adams."
    },
    {
      "id": "garret_adams",
      "name": {
        "full": "Garret Adams"
      },
      "lifespan": {
        "born": {
          "date": "2003-04-10"
        }
      },
      "relationships": {
        "parents": [
          "brendan_mckeldin_adams",
          "megan_marie_falde_adams"
        ]
      },
      "notes": "Brendan McKeldin Adams.docx.",
      "confidence": "high"
    },
    {
      "id": "owen_adams",
      "name": {
        "full": "Owen Adams"
      },
      "lifespan": {
        "born": {
          "date": "2005-10-03"
        }
      },
      "relationships": {
        "parents": [
          "brendan_mckeldin_adams",
          "megan_marie_falde_adams"
        ]
      },
      "notes": "Brendan McKeldin Adams.docx.",
      "confidence": "high"
    },
    {
      "id": "george_francis_adams_jr",
      "name": {
        "full": "George Francis Adams Jr."
      },
      "relationships": {
        "spouses": [
          "cynthia_gail_smith_adams"
        ],
        "parents": [
          "george_francis_adams_sr",
          "beryl_eva_simons_adams"
        ],
        "children": [
          "george_francis_adams_iv",
          "geoffry_louis_adams"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "cynthia_gail_smith_adams": {
            "type": "marriage",
            "confidence": "high"
          }
        },
        "child": {
          "george_francis_adams_iv": {
            "type": "biological",
            "confidence": "high"
          },
          "geoffry_louis_adams": {
            "type": "biological",
            "confidence": "high"
          }
        }
      },
      "place_history": [
        {
          "type": "event",
          "place": "Pierce County (Tacoma), WA",
          "date": "1972-06-17",
          "evidence": "Brendan McKeldin Adams.docx — wedding date and place",
          "confidence": "high"
        }
      ],
      "notes": "Sibling of John Howard Adams and Trudy. Email correspondent (justusnsooz@comcast.net = GFA III). Married Cynthia Gail Smith June 17, 1972, Pierce County (Tacoma), WA. DOB unknown.",
      "confidence": "high"
    },
    {
      "id": "cynthia_gail_smith_adams",
      "name": {
        "full": "Cynthia Gail Smith Adams"
      },
      "relationships": {
        "spouses": [
          "george_francis_adams_jr"
        ],
        "parents": [
          "louis_russell_smith",
          "genevieve_mildred_smith"
        ],
        "children": [
          "george_francis_adams_iv",
          "geoffry_louis_adams"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "george_francis_adams_jr": {
            "type": "marriage",
            "confidence": "high"
          }
        },
        "child": {
          "george_francis_adams_iv": {
            "type": "biological",
            "confidence": "high"
          },
          "geoffry_louis_adams": {
            "type": "biological",
            "confidence": "high"
          }
        }
      },
      "notes": "Brendan McKeldin Adams.docx. DOB unknown. Reconciliation v19: DOB 1950-12-08 promoted from already-cited corpus.",
      "confidence": "medium",
      "lifespan": {
        "born": {
          "date": "1950-12-08"
        }
      }
    },
    {
      "id": "louis_russell_smith",
      "name": {
        "full": "Louis Russell Smith"
      },
      "lifespan": {
        "born": {
          "date": "1928"
        },
        "died": {
          "date": "1993"
        }
      },
      "relationships": {
        "spouses": [
          "genevieve_mildred_smith"
        ],
        "children": [
          "cynthia_gail_smith_adams"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "genevieve_mildred_smith": {
            "type": "marriage",
            "confidence": "medium"
          }
        },
        "child": {
          "cynthia_gail_smith_adams": {
            "type": "biological",
            "confidence": "medium"
          }
        }
      },
      "notes": "Brendan McKeldin Adams.docx.",
      "confidence": "medium"
    },
    {
      "id": "genevieve_mildred_smith",
      "name": {
        "full": "Genevieve Mildred Smith"
      },
      "lifespan": {
        "born": {
          "date": "1931"
        }
      },
      "relationships": {
        "spouses": [
          "louis_russell_smith"
        ],
        "children": [
          "cynthia_gail_smith_adams"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "louis_russell_smith": {
            "type": "marriage",
            "confidence": "medium"
          }
        },
        "child": {
          "cynthia_gail_smith_adams": {
            "type": "biological",
            "confidence": "medium"
          }
        }
      },
      "notes": "DOD unknown — open research item per Adams_Family_History.html. Brendan McKeldin Adams.docx.",
      "confidence": "medium"
    },
    {
      "id": "george_francis_adams_iv",
      "name": {
        "full": "George Francis Adams IV"
      },
      "lifespan": {
        "born": {
          "date": "1973-09-20",
          "place": "Milton, FL"
        }
      },
      "relationships": {
        "spouses": [
          "anne_marie_bainbridge_adams"
        ],
        "parents": [
          "george_francis_adams_jr",
          "cynthia_gail_smith_adams"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "anne_marie_bainbridge_adams": {
            "type": "marriage",
            "confidence": "high"
          }
        }
      },
      "notes": "Married Anne Marie Bainbridge November 23, 1996. Five children: George, Ted, Roy, Sam, Mary (DOBs unknown — not encoded separately). Brendan McKeldin Adams.docx.",
      "confidence": "high"
    },
    {
      "id": "anne_marie_bainbridge_adams",
      "name": {
        "full": "Anne Marie Bainbridge Adams"
      },
      "relationships": {
        "spouses": [
          "george_francis_adams_iv"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "george_francis_adams_iv": {
            "type": "marriage",
            "confidence": "high"
          }
        }
      },
      "notes": "Married George Francis Adams IV November 23, 1996. Brendan McKeldin Adams.docx.",
      "confidence": "medium"
    },
    {
      "id": "geoffry_louis_adams",
      "name": {
        "full": "Geoffry Louis Adams"
      },
      "lifespan": {
        "born": {
          "date": "1976-02-03",
          "place": "Honolulu, HI"
        }
      },
      "relationships": {
        "spouses": [
          "nicole_della_selva_adams"
        ],
        "parents": [
          "george_francis_adams_jr",
          "cynthia_gail_smith_adams"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "nicole_della_selva_adams": {
            "type": "marriage",
            "confidence": "high"
          }
        }
      },
      "notes": "Married Nicole Adawn Della Selva March 23, 2001. Brendan McKeldin Adams.docx.",
      "confidence": "high"
    },
    {
      "id": "nicole_della_selva_adams",
      "name": {
        "full": "Nicole Adawn Della Selva Adams"
      },
      "relationships": {
        "spouses": [
          "geoffry_louis_adams"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "geoffry_louis_adams": {
            "type": "marriage",
            "confidence": "high"
          }
        }
      },
      "notes": "Married Geoffry Louis Adams March 23, 2001. Brendan McKeldin Adams.docx.",
      "confidence": "medium"
    },
    {
      "id": "michelle_ellis_adams",
      "name": {
        "full": "Michelle Ellis Adams"
      },
      "relationships": {
        "spouses": [
          "brian_john_adams"
        ],
        "children": [
          "ethan_adams",
          "gabrielle_adams",
          "lauren_adams",
          "gavin_adams"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "brian_john_adams": {
            "type": "marriage",
            "confidence": "high"
          }
        },
        "child": {
          "ethan_adams": {
            "type": "biological",
            "confidence": "high"
          },
          "gabrielle_adams": {
            "type": "biological",
            "confidence": "high"
          },
          "lauren_adams": {
            "type": "biological",
            "confidence": "high"
          },
          "gavin_adams": {
            "type": "biological",
            "confidence": "high"
          }
        }
      },
      "notes": "Spouse of Brian John Adams. Mother of Ethan, Gabrielle, Lauren, and Gavin Adams.",
      "confidence": "high"
    },
    {
      "id": "ethan_adams",
      "name": {
        "full": "Ethan Adams"
      },
      "relationships": {
        "parents": [
          "brian_john_adams",
          "michelle_ellis_adams"
        ]
      },
      "confidence": "high"
    },
    {
      "id": "gabrielle_adams",
      "name": {
        "full": "Gabrielle Adams"
      },
      "relationships": {
        "parents": [
          "brian_john_adams",
          "michelle_ellis_adams"
        ]
      },
      "confidence": "high"
    },
    {
      "id": "lauren_adams",
      "name": {
        "full": "Lauren Adams"
      },
      "relationships": {
        "parents": [
          "brian_john_adams",
          "michelle_ellis_adams"
        ]
      },
      "confidence": "high"
    },
    {
      "id": "gavin_adams",
      "name": {
        "full": "Gavin Adams"
      },
      "relationships": {
        "parents": [
          "brian_john_adams",
          "michelle_ellis_adams"
        ]
      },
      "confidence": "high"
    },
    {
      "id": "michelle_mckeldin_spouse",
      "name": {
        "full": "Michelle McKeldin"
      },
      "relationships": {
        "spouses": [
          "charles_chuck_mckeldin"
        ],
        "children": [
          "jennifer_mckeldin",
          "charlie_mckeldin"
        ]
      },
      "relationships_meta": {
        "spouse": {
          "charles_chuck_mckeldin": {
            "type": "marriage",
            "confidence": "high"
          }
        },
        "child": {
          "jennifer_mckeldin": {
            "type": "biological",
            "confidence": "high"
          },
          "charlie_mckeldin": {
            "type": "biological",
            "confidence": "high"
          }
        }
      },
      "notes": "Spouse of Charles 'Chuck' McKeldin. Mother of Jennifer and Charlie McKeldin.",
      "confidence": "high"
    },
    {
      "id": "jennifer_mckeldin",
      "name": {
        "full": "Jennifer McKeldin"
      },
      "relationships": {
        "parents": [
          "charles_chuck_mckeldin",
          "michelle_mckeldin_spouse"
        ]
      },
      "confidence": "high"
    },
    {
      "id": "charlie_mckeldin",
      "name": {
        "full": "Charlie McKeldin"
      },
      "relationships": {
        "parents": [
          "charles_chuck_mckeldin",
          "michelle_mckeldin_spouse"
        ]
      },
      "confidence": "high"
    }
  ]
}
;
