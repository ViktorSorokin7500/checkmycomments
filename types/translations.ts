export interface Translations {
  header: Record<
    "pricing" | "signIn" | "signOut" | "analysis" | "language",
    string
  >;
  home: {
    hero: Record<"title" | "subtitle" | "button" | "powered", string>;
    demo: Record<"title1" | "title2" | "title3", string>;
    hiws: Record<
      | "subtitle"
      | "maintitle"
      | "button"
      | "title1"
      | "description1"
      | "title2"
      | "description2"
      | "title3"
      | "description3",
      string
    >;
    pricing: {
      title: string;
      month: string;
      freeMonth: string;
      free: Record<"name" | "description" | "item1" | "item2" | "cta", string>;
      paid: Record<
        "name" | "description" | "item1" | "item2" | "item3" | "cta",
        string
      >;
    };
    cta: Record<"title" | "description" | "cta", string>;
  };
  dashboard: {
    main: Record<"title" | "description" | "cta" | "unavailable", string>;
    dearUsers: {
      description: Record<"1" | "2" | "3" | "4" | "5", string>;
    };
  };
}
