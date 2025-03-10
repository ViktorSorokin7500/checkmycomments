import React from "react";

interface SectionData {
  title: string;
  task1: string;
  time1: string;
  task2: string;
  time2: string;
  task3: string;
  time3: string;
  task4: string;
  time4: string;
  total: string;
  hours: string;
}

interface EfficiencyProps {
  t: {
    title: string;
    classic: SectionData;
    commentPulse: SectionData;
  };
}

interface EfficiencySectionProps {
  data: SectionData;
  isCommentPulse?: boolean;
}

const EfficiencySection = ({
  data,
  isCommentPulse,
}: EfficiencySectionProps) => {
  const tasks = [
    { task: data.task1, time: data.time1 },
    { task: data.task2, time: data.time2 },
    { task: data.task3, time: data.time3 },
    { task: data.task4, time: data.time4 },
  ];

  return (
    <div className="bg-soft-fog/20 shadow-lg max-w-lg w-3/4 lg:w-1/2 py-4 px-8 rounded-lg animate-fade-in-delay">
      <h3
        className={`text-3xl text-center ${
          isCommentPulse ? "text-lime-zest" : "sunset-glow"
        }`}
      >
        {data.title}
      </h3>
      <ul className="py-6 space-y-3">
        {tasks.map(({ task, time }, i) => (
          <li key={i} className="flex justify-between items-center gap-4">
            <span className="text-lg flex-1">{task}</span>
            <span
              className={`${
                isCommentPulse ? "bg-cosmic-blue" : "bg-sunset-glow"
              } px-1 py-0.5 rounded-full w-18`}
            >
              {time}
            </span>
          </li>
        ))}
      </ul>
      <div
        className={`border-r border-dashed border-4 mb-2 ${
          isCommentPulse ? "border-cosmic-blue" : "border-sunset-glow"
        }`}
      />
      <h5 className="text-xl text-center">{data.total}</h5>
      <div className="relative w-full text-center">
        <span
          className={`text-md lg:text-lg w-full sm:w-fit shadow-lg absolute left-1/2 -translate-x-1/2 ${
            isCommentPulse ? "bg-cosmic-blue" : "bg-sunset-glow"
          } px-2 py-0.5 rounded`}
        >
          {data.hours}
        </span>
      </div>
    </div>
  );
};

export function Efficiency({ t }: EfficiencyProps) {
  return (
    <section className="py-12 flex flex-col justify-center items-center lg:flex-row gap-12 lg:gap-8">
      <EfficiencySection data={t.classic} />
      <EfficiencySection data={t.commentPulse} isCommentPulse />
    </section>
  );
}
