import React from 'react';
import services from '../../data/services';
import { Icon, IconArrowRight } from '../icons';
import './FeaturedServices.css';

export default function FeaturedServices() {
  return (
    <section className="services-section" id="services">
      <div className="services-inner">
        <div className="services-header">
          <div className="services-label">Our Services</div>
          <h2 className="services-title">Why Choose Nexora</h2>
          <p className="services-subtitle">
            Quality you can trust — from rigorous testing to expert support, we're committed to delivering the best research-grade compounds.
          </p>
        </div>
        <div className="services-grid">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="service-card"
              style={{ backgroundColor: svc.bgColor, color: svc.accentColor }}
            >
              <div>
                <div
                  className="service-card-icon"
                  style={{ backgroundColor: `${svc.accentColor}18` }}
                >
                  <Icon name={svc.icon} />
                </div>
                <div className="service-card-title">{svc.title}</div>
                <div className="service-card-desc">{svc.description}</div>
                </div>
              <div className="service-card-arrow">
                <IconArrowRight width={16} height={16} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
