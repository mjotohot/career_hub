<script setup lang="ts">
import { PhCheckCircle, PhEnvelopeSimple } from '@phosphor-icons/vue'
import bgImage from '@/assets/images/csu1.jpg'

const features = [
  {
    title: 'Simple Application',
    desc: 'No complicated forms or account creation',
  },
  {
    title: 'Transparent Process',
    desc: 'Stay informed with email status updates',
  },
  {
    title: 'Data Security',
    desc: 'Your information is protected and secure',
  },
  {
    title: 'Fair Hiring',
    desc: 'Equal opportunity for all applicants',
  },
]
</script>

<template>
  <section
    id="about"
    className="relative py-20 px-4 sm:px-6 lg:px-8"
    :style="{
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }"
  >
    <div class="absolute inset-0 bg-black/70 pointer-events-none"></div>
    <div className="max-w-7xl mx-auto relative z-10 text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Our Commitment</h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            We're dedicated to making it easy for talented individuals to join our academic
            community while ensuring secure, efficient recruitment processes.
          </p>
          <ul className="space-y-4">
            <li v-for="(item, idx) in features" :key="idx" className="flex items-start gap-4">
              <PhCheckCircle :size="32" />
              <div>
                <div className="font-semibold text-foreground">{{ item.title }}</div>
                <div className="text-sm text-muted-foreground">{{ item.desc }}</div>
              </div>
            </li>
          </ul>
        </div>
        <div
          className="bg-linear-to-br from-primary/10 to-accent/10 rounded-2xl p-8 border border-gray-200 shadow-lg"
        >
          <div className="text-center space-y-6">
            <div
              className="inline-flex items-center justify-center w-16 h-16 btn btn-soft btn-success text-warning hover:text-white rounded-full"
            >
              <PhEnvelopeSimple :size="32" weight="bold" />
            </div>
            <h3 className="text-2xl font-bold">Application Status</h3>
            <p className="text-muted-foreground leading-relaxed">
              After you apply, you'll receive an email with a personalized link to track your
              application progress. Check your status anytime.
            </p>
            <div className="pt-4 space-y-2 text-sm">
              <p className="text-foreground font-medium">You'll receive:</p>
              <ul className="text-muted-foreground space-y-1">
                <li>• Initial confirmation of receipt</li>
                <li>• Status updates during review</li>
                <li>• Final decision notification</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
