import { useState } from "react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { CalendarIcon, ChevronDown, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../lib/utils";
import { useDropzone } from "react-dropzone";

interface TokenCampaignDetailsProps {
  onUpdate: (details: any) => void;
}

export default function TokenCampaignDetails({
  onUpdate,
}: TokenCampaignDetailsProps) {
  const [details, setDetails] = useState<{
    token: string;
    numberOfTokens: string;
    numberOfRecipients: string;
    title: string;
    description: string;
    coverImage: File | null;
    startDate: Date | null;
    endDate: Date | null;
  }>({
    token: "",
    numberOfTokens: "",
    numberOfRecipients: "",
    title: "",
    description: "",
    coverImage: null,
    startDate: null,
    endDate: null,
  });

  const [isTokenDialogOpen, setIsTokenDialogOpen] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
    onUpdate({ ...details, [name]: value });
  };

  const handleTokenSelect = (token: string) => {
    setDetails((prev) => ({ ...prev, token }));
    onUpdate({ ...details, token });
    setIsTokenDialogOpen(false);
  };

  const handleDateChange = (name: string) => (date: Date | null) => {
    setDetails((prev) => ({ ...prev, [name]: date }));
    onUpdate({ ...details, [name]: date });
  };

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setDetails((prev) => ({ ...prev, coverImage: file }));
    onUpdate({ ...details, coverImage: file });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="token" className="text-lg font-medium text-gray-700">
          Select Token
        </Label>
        <Dialog open={isTokenDialogOpen} onOpenChange={setIsTokenDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full justify-between mt-1">
              {details.token || "Select a token"}
              <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">
                Select A Token
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search name or paste address"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">
                Native Currencies & Stablecoins
              </h3>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="bg-white hover:bg-gray-100"
                  onClick={() => handleTokenSelect("DAI")}
                >
                  <img
                    src="https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png?v=040"
                    alt="DAI"
                    className="w-5 h-5 mr-2"
                  />
                  DAI
                </Button>
                <Button
                  variant="outline"
                  className="bg-white hover:bg-gray-100"
                  onClick={() => handleTokenSelect("USDC")}
                >
                  <img
                    src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=040"
                    alt="USDC"
                    className="w-5 h-5 mr-2"
                  />
                  USDC
                </Button>
                <Button
                  variant="outline"
                  className="bg-white hover:bg-gray-100"
                  onClick={() => handleTokenSelect("DEGEN")}
                >
                  <img
                    src="https://cryptologos.cc/logos/degen-base-degen-logo.png?v=040"
                    alt="DEGEN"
                    className="w-5 h-5 mr-2"
                  />
                  DEGEN
                </Button>
              </div>
            </div>
            <div className="mt-6">
              <Button
                variant="outline"
                className="w-full bg-white hover:bg-gray-100"
              >
                Import Token
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <Label
          htmlFor="numberOfTokens"
          className="text-lg font-medium text-gray-700"
        >
          Number of Tokens
        </Label>
        <Input
          id="numberOfTokens"
          name="numberOfTokens"
          type="number"
          value={details.numberOfTokens}
          onChange={handleChange}
          className="mt-1"
        />
      </div>

      <div>
        <Label
          htmlFor="numberOfRecipients"
          className="text-lg font-medium text-gray-700"
        >
          Number of Recipients
        </Label>
        <Input
          id="numberOfRecipients"
          name="numberOfRecipients"
          type="number"
          value={details.numberOfRecipients}
          onChange={handleChange}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="title" className="text-lg font-medium text-gray-700">
          Campaign Title
        </Label>
        <Input
          id="title"
          name="title"
          value={details.title}
          onChange={handleChange}
          className="mt-1"
        />
      </div>

      <div>
        <Label
          htmlFor="description"
          className="text-lg font-medium text-gray-700"
        >
          Campaign Description
        </Label>
        <Textarea
          id="description"
          name="description"
          value={details.description}
          onChange={handleChange}
          className="mt-1"
        />
      </div>

      <div>
        <Label className="text-lg font-medium text-gray-700">
          Cover Image (Optional)
        </Label>
        <div
          {...getRootProps()}
          className={`mt-1 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-300 ${
            isDragActive
              ? "border-purple-600 bg-purple-50"
              : "border-gray-300 hover:border-purple-400"
          }`}
        >
          <input {...getInputProps()} />
          <p className="text-gray-500">
            Drag 'n' drop an image here, or click to select a file
          </p>
        </div>
        {details.coverImage && (
          <p className="mt-2 text-sm text-gray-500">
            File selected: {details.coverImage.name}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label
            htmlFor="startDate"
            className="text-lg font-medium text-gray-700"
          >
            Start Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal mt-1",
                  !details.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {details.startDate ? (
                  format(details.startDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={details.startDate || undefined}
                onSelect={(date: Date | undefined) =>
                  handleDateChange("startDate")(date || null)
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label
            htmlFor="endDate"
            className="text-lg font-medium text-gray-700"
          >
            End Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal mt-1",
                  !details.endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {details.endDate ? (
                  format(details.endDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={details.endDate || undefined}
                onSelect={(date: Date | undefined) =>
                  handleDateChange("endDate")(date || null)
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
