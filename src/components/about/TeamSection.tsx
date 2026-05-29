import MemberCard from "./MemberCard";

type TeamMember = {
  gender: "male" | "female";
  name: string;
  description: string;
};

type TeamSectionProps = {
  title: string;
  members: TeamMember[];
  size?: "normal" | "large";
  columns?: string;
};

const TeamIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c.8-3.4 2.8-5 5.5-5s4.7 1.6 5.5 5" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M14.5 15.5c1-.7 2-1 3-1 2.3 0 3.8 1.4 4.4 4.5" />
    </svg>
  );
};

const TeamSection = ({
  title,
  members,
  size = "normal",
  columns = "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",
}: TeamSectionProps) => {
  return (
    <section className="w-full space-y-4 text-right">
      <div className="about-section-title flex w-full items-center justify-start gap-2">
        <TeamIcon />
        <span className="text-lg font-bold">{title}</span>
      </div>

      <div className={`grid gap-5 ${columns}`}>
        {members.map((member, index) => (
          <MemberCard
            key={`${title}-${index}`}
            gender={member.gender}
            size={size}
            title={member.name}
            description={member.description}
          />
        ))}
      </div>
    </section>
  );
};

export default TeamSection;