import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Organization = {
  id: string;
  name: string;
  slug: string;
  isPersonal: boolean;
};

const organizations: Organization[] = [
  { id: "1", name: "Acme Corp", slug: "acme", isPersonal: true },
  { id: "2", name: "Startup Inc", slug: "startup", isPersonal: false },
  { id: "3", name: "Tech Giants", slug: "tech-giants", isPersonal: false },
];

function OrganizationSelector() {
  return (
    <Select defaultValue={organizations[0].id}>
      <SelectTrigger className="border-none p-0 w-auto">
        <SelectValue placeholder="Select organization" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Personal</SelectLabel>
          {organizations
            .filter((org) => org.isPersonal)
            .map((org) => (
              <SelectItem key={org.id} value={org.id}>
                {org.name}
              </SelectItem>
            ))}
        </SelectGroup>
        <SelectGroup className="mt-2">
          <SelectLabel>Organizations</SelectLabel>
          {organizations
            .filter((org) => !org.isPersonal)
            .map((org) => (
              <SelectItem key={org.id} value={org.id}>
                {org.name}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default OrganizationSelector;
