export const siteConfig = {
  name: 'SeraPOS',
  contactEmail: null, // Add the approved public address here when supplied.
  appUrl: null, // Do not point to a private merchant application.
  preview: true,
  plans: [
    {name:'Starter',price:10,tag:'A focused beginning',description:'For the essentials of your retail day.',items:['Sales & invoice workspace','Product catalogue','Customer records','Daily business overview']},
    {name:'Growth',price:30,tag:'Room for the next chapter',description:'For a business with more moving parts.',items:['Everything in Starter','Stock & purchasing workflows','Customer balances & statements','A broader view of your reports']},
    {name:'Business',price:50,tag:'A wider view',description:'For teams planning their next step.',items:['Everything in Growth','Location & team control','Extended operational workflows','Plugin & template configuration']}
  ]
};
