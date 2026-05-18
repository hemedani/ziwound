import { ObjectId } from "lesan";
import { warCriminal } from "../mod.ts";

export const seedWarCriminals = async () => {
  const existingCount = await warCriminal.countDocument({ filter: {} });
  if (existingCount > 0) {
    console.log("WarCriminal seed data already exists, skipping...");
    return;
  }

  console.log("Seeding WarCriminal data...");

  await warCriminal.insertMany({
    docs: [
      {
        fullName: "Slobodan Milosevic",
        aliases: ["Butcher of the Balkans"],
        dateOfBirth: new Date("1941-08-20"),
        nationality: ["RS"],
        affiliation: "Government",
        rankOrPosition: "President",
        knownFor: {
          en: "President of Serbia and Yugoslavia during the Yugoslav Wars. Accused of ethnic cleansing, crimes against humanity, and genocide in Bosnia, Croatia, and Kosovo.",
          fa: "رئیس‌جمهور صربستان و یوگسلاوی در طول جنگ‌های یوگسلاوی. متهم به پاکسازی قومی، جنایات علیه بشریت و نسل‌کشی در بوسنی، کرواسی و کوزوو.",
        },
        biography: {
          en: "Slobodan Milosevic was a Serbian politician who served as President of Serbia (1989-1997) and President of the Federal Republic of Yugoslavia (1997-2000). He was the first sitting head of state to be indicted for war crimes by an international tribunal.",
        },
        status: "Deceased",
        convictionDetails: {
          en: "Indicted by the International Criminal Tribunal for the former Yugoslavia (ICTY) in 1999 for war crimes, crimes against humanity, and genocide. Trial began in 2002 but ended without verdict when he died in his cell at The Hague in 2006.",
        },
        isEntity: false,
      },
      {
        fullName: "Wagner Group",
        aliases: ["PMC Wagner", "Wagner PMC"],
        affiliation: "Private Military Company",
        rankOrPosition: "Mercenary Organization",
        knownFor: {
          en: "Russian state-funded private military company involved in conflicts in Ukraine, Syria, Central African Republic, Mali, and Libya. Accused of mass executions, torture, and crimes against civilians.",
          fa: "شرکت نظامی خصوصی وابسته به دولت روسیه که در درگیری‌های اوکراین، سوریه، جمهوری آفریقای مرکزی، مالی و لیبی نقش داشته. متهم به اعدام دسته‌جمعی، شکنجه و جنایات علیه غیرنظامیان.",
          ar: "شركة عسكرية خاصة ممولة من الدولة الروسية متورطة في النزاعات في أوكرانيا وسوريا وجمهورية أفريقيا الوسطي ومالي وليبيا. متهمة بعمليات إعدام جماعية وتعذيب وجرائم ضد المدنيين.",
        },
        biography: {
          en: "The Wagner Group is a Russian private military company that has operated as a proxy force for Russian interests worldwide. Founded by Dmitry Utkin and funded by Yevgeny Prigozhin, the group has been implicated in numerous war crimes and human rights violations across multiple conflict zones.",
        },
        status: "Sanctioned",
        convictionDetails: {
          en: "Subject to international sanctions by the US, EU, and UK. Multiple investigations ongoing for war crimes in Ukraine and Africa. Leader Yevgeny Prigozhin killed in plane crash in August 2023.",
        },
        isEntity: true,
      },
      {
        fullName: "Radovan Karadzic",
        aliases: ["Butcher of Bosnia"],
        dateOfBirth: new Date("1945-06-19"),
        nationality: ["BA"],
        affiliation: "Political",
        rankOrPosition: "President of Republika Srpska",
        knownFor: {
          en: "Bosnian Serb politician who led the Republika Srpska during the Bosnian War. Mastermind of the Srebrenica genocide and the Siege of Sarajevo.",
          fa: "سیاستمدار صرب بوسنیایی که رهبری جمهوری صربسکا را در طول جنگ بوسنی بر عهده داشت. طراح نسل‌کشی سربرنیتسا و محاصره سارایوو.",
        },
        biography: {
          en: "Radovan Karadzic was a Bosnian Serb former politician and convicted war criminal who served as the President of Republika Srpska during the Bosnian War. He was found guilty of genocide, war crimes, and crimes against humanity.",
        },
        status: "Convicted",
        convictionDetails: {
          en: "Convicted by the ICTY in 2016 of genocide (Srebrenica), crimes against humanity, and war crimes. Sentenced to life imprisonment after appeal in 2019 increased from original 40-year sentence.",
        },
        isEntity: false,
      },
    ],
    relations: {},
    projection: { fullName: 1, status: 1 },
  });

  console.log("WarCriminal seed data created successfully!");
};
