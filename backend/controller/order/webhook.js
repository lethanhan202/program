const stripe = require('../../config/stripe')
const addToCartModel = require('../../models/cartProduct')
const orderModel = require('../../models/orderModel')

const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET_KEY

async function getLineItems(lineItem) {
    let productItems = []

    if (lineItem?.data?.length) {
        for (const item of lineItem?.data) {
            const product = await stripe.products.retrieve(item.price.product)
            const productId = product.metadata.productId

            const productData = {
                productId: productId,
                name: product.name,
                price: item.price.unit_amount / 100,
                quantity: item.quantity,
                image: product.images
            }

            productItems.push(productData)
        }
    }

    return productItems
}


const webhooks = async (req, res) => {
    const sig = req.headers['stripe-signature'];

    const payload = JSON.stringify(req.body)

    const header = stripe.webhooks.generateTestHeaderString({
        payload: payload,
        secret: endpointSecret
    })

    let event;

    try {
        event = stripe.webhooks.constructEvent(payload, header, endpointSecret);
    } catch (error) {
        res.status(400).send(`Webhook Error: ${error.message}`);
        return;
    }

    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;

            const lineItems = await stripe.checkout.sessions.listLineItems(session.id)

            const productDetails = await getLineItems(lineItems)

            const orderDetails = {
                productDetails: productDetails,
                email: session?.customer_email,
                userId: session.metadata.userId,
                paymentDetails: {
                    paymentId: session.payment_intent,
                    payment_method_type: session.payment_method_types,
                    payment_status: session.payment_status
                },
                shipping_options: session.shipping_options.map(s => {
                    return { ...s, shipping_amount: s.shipping_amount / 100 }
                }),
                totalAmount: session.amount_total / 100
            }
            const order = new orderModel(orderDetails)
            const saveOrder = await order.save()

            if (saveOrder._id) {
                const deleteCart = await addToCartModel.deleteMany({ userId: session.metadata.userId })
            }
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }


    res.status(200).send()
}


module.exports = webhooks