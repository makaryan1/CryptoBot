import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface SupportTicket {
  id: number;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface SupportMessage {
  id: number;
  ticketId: number;
  message: string;
  isAdmin: boolean;
  createdAt: string;
}

const supportSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  category: z.string().min(1, "Please select a category"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type SupportFormValues = z.infer<typeof supportSchema>;

const replySchema = z.object({
  message: z.string().min(5, "Reply must be at least 5 characters"),
});

type ReplyFormValues = z.infer<typeof replySchema>;

export default function SupportPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const { toast } = useToast();
  
  const form = useForm<SupportFormValues>({
    resolver: zodResolver(supportSchema),
    defaultValues: {
      subject: "",
      category: "",
      message: "",
    },
  });
  
  const replyForm = useForm<ReplyFormValues>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      message: "",
    },
  });
  
  // Fetch support tickets
  const { data: tickets, isLoading: isTicketsLoading } = useQuery<SupportTicket[]>({
    queryKey: ["/api/support/tickets"],
  });
  
  // Fetch messages for selected ticket
  const { data: messages, isLoading: isMessagesLoading } = useQuery<SupportMessage[]>({
    queryKey: ["/api/support/tickets", selectedTicket, "messages"],
    enabled: !!selectedTicket,
  });
  
  // Create support ticket
  const createTicketMutation = useMutation({
    mutationFn: async (data: SupportFormValues) => {
      const res = await apiRequest("POST", "/api/support/tickets", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/support/tickets"] });
      form.reset();
      toast({
        title: "Ticket created",
        description: "Your support ticket has been successfully created.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating ticket",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Reply to ticket
  const replyTicketMutation = useMutation({
    mutationFn: async ({ ticketId, message }: { ticketId: number; message: string }) => {
      const res = await apiRequest("POST", `/api/support/tickets/${ticketId}/reply`, { message });
      return res.json();
    },
    onSuccess: () => {
      if (selectedTicket) {
        queryClient.invalidateQueries({ queryKey: ["/api/support/tickets", selectedTicket, "messages"] });
      }
      replyForm.reset();
      toast({
        title: "Reply sent",
        description: "Your reply has been sent successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error sending reply",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const onSubmit = (data: SupportFormValues) => {
    createTicketMutation.mutate(data);
  };
  
  const onReplySubmit = (data: ReplyFormValues) => {
    if (selectedTicket) {
      replyTicketMutation.mutate({
        ticketId: selectedTicket,
        message: data.message,
      });
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const categories = [
    "General Inquiry",
    "Account Issues",
    "Deposit/Withdrawal",
    "KYC Verification",
    "Trading Bots",
    "Technical Issues",
    "Security Concerns",
    "Referral Program",
    "Other",
  ];
  
  const faqs = [
    {
      question: "How do I start using a trading bot?",
      answer: "To start using a trading bot, go to the 'Trading Bots' page, select a bot that matches your strategy, click 'Launch Bot', enter the investment amount, and confirm. The bot will automatically start trading based on its algorithm."
    },
    {
      question: "What fees are charged for withdrawals?",
      answer: "There is a 20% fee on all withdrawals. This fee helps maintain the platform and its services. The fee is automatically calculated and deducted when you process a withdrawal."
    },
    {
      question: "How long does the KYC verification process take?",
      answer: "Level 1 KYC verification usually takes 1-2 business days. Level 2 verification can take 2-3 business days due to the additional checks required. You'll receive an email notification once your verification is complete."
    },
    {
      question: "How does the referral program work?",
      answer: "When you refer someone to our platform using your unique referral link, you earn a percentage of their trading profits. Bronze level earns 1%, Silver 2%, and Gold 5%. Your level increases based on the number of active referrals you have."
    },
    {
      question: "What cryptocurrencies are supported for deposits?",
      answer: "We support over 20 cryptocurrencies including USDT (TRC20, BEP20, ERC20), BTC, ETH, TRX, SOL, APT, BNB, ADA, XRP, and more. To make a deposit, go to the Wallet page and select your preferred currency."
    },
    {
      question: "How are bot profits calculated and distributed?",
      answer: "Bot profits are calculated based on the trading strategy and market conditions. The profits are automatically added to your wallet as they are realized. You can view your profit history in the Transactions page."
    },
  ];
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        <Header 
          toggleSidebar={toggleSidebar} 
          title="Support" 
          subtitle="Get help with your account and trading" 
        />
        
        <div className="mb-6">
          <Tabs defaultValue="tickets" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="tickets">My Tickets</TabsTrigger>
              <TabsTrigger value="new">New Ticket</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tickets">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Support Tickets</CardTitle>
                      <CardDescription>
                        View and manage your support requests
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isTicketsLoading ? (
                        <div className="text-center py-10">
                          <p>Loading tickets...</p>
                        </div>
                      ) : !tickets || tickets.length === 0 ? (
                        <div className="text-center py-10">
                          <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-primary mb-3">
                            <i className="ri-customer-service-2-line text-xl"></i>
                          </div>
                          <h3 className="text-lg font-medium mb-2">No Tickets Yet</h3>
                          <p className="text-neutral-400 mb-4">Create your first support ticket</p>
                          <Button onClick={() => document.querySelector('[value="new"]')?.dispatchEvent(new Event('click'))}>
                            Create Ticket
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {tickets.map((ticket) => (
                            <div 
                              key={ticket.id} 
                              className={`p-3 border rounded-md cursor-pointer hover:border-primary transition-colors ${
                                selectedTicket === ticket.id ? 'border-primary bg-blue-50' : ''
                              }`}
                              onClick={() => setSelectedTicket(ticket.id)}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-medium truncate">{ticket.subject}</h3>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  ticket.status === 'open' 
                                    ? 'bg-green-100 text-green-800' 
                                    : ticket.status === 'pending' 
                                      ? 'bg-yellow-100 text-yellow-800' 
                                      : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                                </span>
                              </div>
                              <p className="text-xs text-neutral-500">
                                Created: {formatDate(ticket.createdAt)}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <div className="md:col-span-2">
                  {selectedTicket ? (
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>
                              {tickets?.find(t => t.id === selectedTicket)?.subject}
                            </CardTitle>
                            <CardDescription>
                              Ticket #{selectedTicket} • {tickets?.find(t => t.id === selectedTicket)?.status}
                            </CardDescription>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedTicket(null)}
                          >
                            Back to List
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {isMessagesLoading ? (
                          <div className="text-center py-10">
                            <p>Loading messages...</p>
                          </div>
                        ) : !messages || messages.length === 0 ? (
                          <div className="text-center py-10">
                            <p>No messages found for this ticket.</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {messages.map((message) => (
                              <div 
                                key={message.id} 
                                className={`p-4 rounded-lg ${
                                  message.isAdmin 
                                    ? 'bg-blue-50 ml-12' 
                                    : 'bg-gray-50 mr-12'
                                }`}
                              >
                                <div className="flex items-center mb-2">
                                  <div className={`w-8 h-8 rounded-full ${
                                    message.isAdmin 
                                      ? 'bg-primary text-white' 
                                      : 'bg-gray-200'
                                  } flex items-center justify-center mr-2`}>
                                    <i className={message.isAdmin ? 'ri-customer-service-2-line' : 'ri-user-line'}></i>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">
                                      {message.isAdmin ? 'Support Agent' : 'You'}
                                    </p>
                                    <p className="text-xs text-neutral-500">
                                      {formatDate(message.createdAt)}
                                    </p>
                                  </div>
                                </div>
                                <p className="text-sm whitespace-pre-line">{message.message}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {selectedTicket && tickets?.find(t => t.id === selectedTicket)?.status !== 'closed' && (
                          <div className="mt-6">
                            <Form {...replyForm}>
                              <form onSubmit={replyForm.handleSubmit(onReplySubmit)}>
                                <FormField
                                  control={replyForm.control}
                                  name="message"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Reply</FormLabel>
                                      <FormControl>
                                        <Textarea 
                                          placeholder="Type your reply here..." 
                                          className="min-h-32" 
                                          {...field} 
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <div className="mt-4 flex justify-end">
                                  <Button 
                                    type="submit" 
                                    disabled={replyTicketMutation.isPending}
                                  >
                                    {replyTicketMutation.isPending ? "Sending..." : "Send Reply"}
                                  </Button>
                                </div>
                              </form>
                            </Form>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-primary mb-3">
                          <i className="ri-chat-3-line text-2xl"></i>
                        </div>
                        <h3 className="text-lg font-medium mb-2">Select a Ticket</h3>
                        <p className="text-neutral-400">
                          Choose a ticket from the list to view its details
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="new">
              <Card>
                <CardHeader>
                  <CardTitle>Create Support Ticket</CardTitle>
                  <CardDescription>
                    Submit a support request and our team will help you
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                              <Input placeholder="Brief summary of your issue" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe your issue in detail..." 
                                className="min-h-32" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Please provide as much detail as possible to help us resolve your issue quickly
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        disabled={createTicketMutation.isPending}
                      >
                        {createTicketMutation.isPending ? "Submitting..." : "Submit Ticket"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="faq">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>
                    Find quick answers to common questions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium mb-2">Still have questions?</h3>
                    <p className="text-sm text-neutral-600 mb-4">
                      If you couldn't find the answer to your question, please create a support ticket and our team will assist you.
                    </p>
                    <Button onClick={() => document.querySelector('[value="new"]')?.dispatchEvent(new Event('click'))}>
                      Create Support Ticket
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
