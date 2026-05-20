import Card from "../components/task-card/Card";

export default function TestCard() {
  return (
    <div className="min-h-screen bg-[#717171] pt-[10px] px-[0] overflow-x-auto">

      <div className="flex flex-nowrap gap-[10px]">
        <Card />
        <Card />
        <Card />
        <Card />
      </div>

    </div>
  );
}
